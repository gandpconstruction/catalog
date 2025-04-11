/**
 * This script imports data from a CSV file and publishes it to a Cosmos DB container.
 * It processes the CSV file line by line, transforms the data, and creates items in the database.
 * The script is executed using the command:
 * 
 * `npx tsx src/scripts/import.ts <catalogId> <pathToCSV>`
 * 
 */

import '../config/environment'
import Cosmos from '@/lib/cosmos';
import { Command } from 'commander';
import { parse } from 'papaparse';
import pLimit from 'p-limit'

const limit = pLimit(20); // 10 concurrent requests

async function publishToCosmos(catalogId : string, item: object) {
    const container = Cosmos.database('Catalogs').container('CatalogItems');
    try {
        const { resource: createdItem } = await container.items.create({
            catalogId,
            data: item,
        });
        if (!createdItem) {
            throw new Error('Item creation failed');
        }
        console.log(`Created item with id: ${createdItem.id}`);
    }
    catch (error) {
        console.error('Error creating item:', error);
        return;
    }
}

async function main({ catalogId, csv }: { catalogId: string; csv: string }) {
    const promises : Promise<void>[] = [];
    // csv is a file name
    const file = require('fs').readFileSync(csv, 'utf8');
    const container = Cosmos.database('Catalogs').container('CatalogConfigurations');
    console.log(container.id);
    const items = await container.items.query('SELECT * from c').fetchAll();
    parse(file, {
        header: true,
        dynamicTyping: true,
        // preview: 10,
        skipEmptyLines: true,
        transform(value, header) {
            // if header is pallet receipt date, convert to date from YYYYMMDD
            if (header === 'Pallet Receipt Date') {
                if(!/^(\d){8}$/.test(value)) return "invalid date";
                var y = parseInt(value.substring(0,4)),
                    m = parseInt(value.substring(4,6)) - 1,
                    d = parseInt(value.substring(6,8));
                return new Date(y, m, d);
            }
            // remove leading $, and trim
            return value.replace(/^\$/, '').trim();
        },
        step: async function(results, parser) {
            if (results.data) {
                promises.push(limit(() => publishToCosmos(catalogId, results.data)));
            }
        },
        complete: async function(results, file) {
            console.log(promises.length)
            await Promise.all(promises);
        }
        
    });
    return Promise.all(promises).then(() => {
        console.log('All items published');
    }).catch((error) => {
        console.error('Error publishing items:', error);
    }
    );
}

function optionsFromArgs() {
    const program = new Command();
    program
        .argument('<catalogId>')
        .argument('<csv>');
    program.parse(process.argv);
    const [catalogId, csv] = program.processedArgs;

    return { catalogId, csv };
}


main(optionsFromArgs()).catch((error) => {
    console.error(error);
});