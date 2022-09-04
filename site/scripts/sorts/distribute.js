sorts.counting = {
    run: async function () {

        sort.set_delay(1500/sort.arr.length);

        let max = 0, decimal = false;

        for (let i = 0; i < sort.arr.length; i++) {

            const val = await sort.get(i);

            if (val > max) max = val;

            if (val % 1 !== 0) decimal = true;

        }

        let base = Math.ceil(max)+1;

        let buckets = Array.from({length: base}, () => {return []});
    
        for (let i = 0; i < sort.arr.length; i++) {
            buckets[Math.floor((await sort.get(i))) % base].push(sort.arr[i]);
            sort.values.writes_aux++;
        }

        const combined = buckets.reduce((a,b) => {return a.concat(b)});
            
        for (let i = 0; i < combined.length; i++) {
            await sort.write.write(i,combined[i]);
        }

        if (decimal) {

            sort.set_delay(20000/Math.pow(sort.arr.length,2));
    
            for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i - 1;
            
                while (i >= 0 && await sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + 1, i);
                
                    i--;
                
                }
    
                await sort.write.write(i+1,replace);
            
            }

        }

    },
    name: "Counting Sort"
}

sorts.pigeonhole = {
    run: async function () {

        sort.set_delay(2000/sort.arr.length);

        let min = 0, max = 0;

        for (let i = 0; i <= sort.arr.length; i++) {
            if (sort.arr[i] < sort.arr[min]) min = i;
            if (sort.arr[i] > sort.arr[max]) max = i;
        }

        let holes = Array.from({length: sort.arr[max] - sort.arr[min] + 1});

        for (let i = 0; i < sort.arr.length; i++) {
            holes[Math.round(await sort.get(i) - sort.arr[min])] = sort.arr[i];
            sort.values.writes_aux++;
        }

        for (let i = 0; i < holes.length; i++) {
            await sort.write.write(i,holes[i] || 0);
        }

    },
    name: "Pigeonhole Sort",
    require_int: true
}

sorts.radix_lsd = {
    run: async function (base) {

        sort.set_delay(3000/sort.arr.length);

        let max = 0, decimal = false;

        for (let i = 0; i < sort.arr.length; i++) {

            const val = await sort.get(i);

            if (val > max) max = val;

            if (val % 1 !== 0) decimal = true;

        }

        let max_digits = Math.ceil(Math.log2(max) / Math.log2(base));

        for (let x = 0; x < max_digits; x++) {

            let buckets = Array.from({length: base}, () => {return []});
    
            for (let i = 0; i < sort.arr.length; i++) {
                buckets[Math.floor((await sort.get(i)) / Math.pow(base,x)) % base].push(sort.arr[i]);
                sort.values.writes_aux++;
            }

            const combined = buckets.reduce((a,b) => {return a.concat(b)});
            
            for (let i = 0; i < combined.length; i++) {
                await sort.write.write(i,combined[i]);
            }

        }

        if (decimal) {

            sort.set_delay(20000/Math.pow(sort.arr.length,2));
    
            for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i - 1;
            
                while (i >= 0 && await sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + 1, i);
                
                    i--;
                
                }
    
                await sort.write.write(i+1,replace);
            
            }

        }

    },
    name: "Radix LSD Sort",
    base: 4
}

sorts.radix_msd = {
    run: async function (base) {

        sort.set_delay(3000/sort.arr.length);

        let max = 0, decimal = false;

        for (let i = 0; i < sort.arr.length; i++) {

            const val = await sort.get(i);

            if (val > max) max = val;

            if (val % 1 !== 0) decimal = true;

        }

        let max_digits = Math.ceil(Math.log2(max) / Math.log2(base));

        async function msd(l,r,x) {

            if (x < 0 || l >= r) return;

            let buckets = Array.from({length: base}, () => {return []});
    
            for (let i = l; i < r; i++) {
                buckets[Math.floor((await sort.get(i)) / Math.pow(base,x)) % base].push(sort.arr[i]);
                sort.values.writes_aux++;
            }

            const combined = buckets.reduce((a,b) => {return a.concat(b)});
            
            for (let i = 0; i < combined.length; i++) {
                await sort.write.write(i+l,combined[i]);
            }

            let pointer = [], v = l;

            for (let i = 0; i < buckets.length; i++) {

                pointer[i] = v;

                v += buckets[i].length;

                pointer[i] = [pointer[i],v]
                
            }

            delete buckets;
            delete combined;

            for (let i = 0; i < pointer.length; i++) {

                await msd(...pointer[i],x-1);

            }

        }
        
        await msd(0,sort.arr.length,max_digits-1);

        if (decimal) {

            sort.set_delay(20000/Math.pow(sort.arr.length,2));
    
            for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i - 1;
            
                while (i >= 0 && await sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + 1, i);
                
                    i--;
                
                }
    
                await sort.write.write(i+1,replace);
            
            }
            
        }

    },
    name: "Radix MSD Sort",
    base: 4
}