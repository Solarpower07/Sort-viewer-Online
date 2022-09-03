sorts.merge = {
    run: async function () {

        sort.set_delay(20000/(sort.arr.length*Math.log2(sort.arr.length)));

        async function merge ([l1,r1],[l2,r2]) {

            let merged = [];

            let lpoint = l1, rpoint = l2;

            while (lpoint <= r1 || rpoint <= r2) {

                if (lpoint > r1) {
                    while (rpoint <= r2) {
                        merged.push(sort.arr[rpoint]);
                        sort.values.writes_aux++;
                        rpoint++;
                    }
                    break;
                }
                else if (rpoint > r2) {
                    while (lpoint <= r1) {
                        merged.push(sort.arr[lpoint]);
                        sort.values.writes_aux++;
                        lpoint++;
                    }
                    break;
                }
            
                if (await sort.compareind.greater_eq(lpoint,rpoint)) {
                    merged.push(sort.arr[rpoint]);
                    rpoint++;
                }
                else {
                    merged.push(sort.arr[lpoint]);
                    lpoint++;
                }

                sort.values.writes_aux++;

            }

            for (let i = 0; i < merged.length; i++) {
                await sort.write.write(i+l1,merged[i]);
            }

            delete merged;

            return [l1,r2];
        
        }

        async function recursive (l,r) {
        
            if (r-l < 1) return [l,r];
        
            let i = Math.floor((r + l) / 2);
        
            return await merge(await recursive(l,i),await recursive(i+1,r));
        
        }

        await recursive(0, sort.arr.length-1);

    },
    name: "Merge Sort"
}

sorts.insertion_merge = {
    run: async function () {

        sort.set_delay(2000/(sort.arr.length*Math.log2(sort.arr.length)));

        async function insertion (l,r) {

            for (let cur_i = l; cur_i <= r; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i - 1;
            
                while (i >= l && await sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + 1, i);
                
                    i--;
                
                }
    
                await sort.write.write(i+1,replace);
            
            }

            return [l,r];
        
        }

        async function recursive (l,r) {
        
            if (r-l < 1) return [l,r];
        
            let i = Math.floor((r + l) / 2);
        
            return await insertion((await recursive(l,i))[0],(await recursive(i+1,r))[1]);
        
        }

        await recursive(0, sort.arr.length-1);

    },
    name: "Insertion Merge Sort"
}

sorts.comb_merge = {
    run: async function () {

        sort.set_delay(5000/(sort.arr.length*Math.log2(sort.arr.length)));

        async function insertion (l,r) {

            for (let cur_i = l; cur_i <= r; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i - 1;
            
                while (i >= l && await sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + 1, i);
                
                    i--;
                
                }
    
                await sort.write.write(i+1,replace);
            
            }

            return [l,r];
        
        }

        async function merge (l,r) {

            let length = (r - l) + 1;
        
            let gap = length;
    
            while (gap > 8) {
    
                if (gap > 1) gap = Math.floor(gap / 1.3);
    
                for (let i = l; i < r - gap; i++) {
    
                    if (await sort.compareind.greater(i, i + gap)) await sort.write.swap(i, i + gap);
    
                }
            
            }

            return await insertion(l,r);
        
        }

        async function recursive (l,r) {
        
            if (r-l < 1) return [l,r];
        
            let i = Math.floor((r + l) / 2);
        
            return await merge((await recursive(l,i))[0],(await recursive(i+1,r))[1]);
        
        }

        await recursive(0, sort.arr.length-1);

    },
    name: "Comb/Insertion Merge Sort"
}