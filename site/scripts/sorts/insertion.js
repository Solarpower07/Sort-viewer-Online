sorts.insertion = {
    run: async function () {

        sort.set_delay(25000/Math.pow(sort.arr.length,2));

        for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {

            let replace = sort.arr[cur_i];

            let i = cur_i - 1;
        
            while (i >= 0 && await sort.compare.less(replace, await sort.get(i))) {
            
                await sort.write.overwrite(i + 1, i);
            
                i--;
            
            }

            if (i+1 !== cur_i) await sort.write.write(i+1,replace);
        
        }
    },
    name: "Insertion Sort"
}

sorts.binary_insertion = {
    run: async function () {

        // sort.set_delay(20000/Math.pow(sort.arr.length,2));

        async function binary_search (l, r, search) {

            if (l >= r) return l;

            let search_i = Math.floor((r+l)/2);

            if (await sort.compareind.less_eq(search_i,search)) return await binary_search(search_i+1,r,search);
            else return await binary_search(l,search_i,search);
            
        }

        for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {

            let replace = sort.arr[cur_i];

            let i = cur_i-1;

            sort.set_delay(200/Math.log2(sort.arr.length));

            let search_i = await binary_search(0,cur_i,cur_i);

            sort.set_delay(100/sort.arr.length);
        
            while (i >= search_i) {
            
                await sort.write.overwrite(i+1, i);
            
                i--;
            
            }

            if (i+1 !== cur_i) await sort.write.write(search_i,replace);
        
        }
    },
    name: "Binary Insertion Sort"
}

sorts.shell = {
    run: async function () {

        sort.set_delay(7500/(sort.arr.length*Math.log2(sort.arr.length)));

        let gap = sort.arr.length;

        while (gap > 1) {

            gap = Math.ceil((gap / 2) - 1);

            for (let cur_i = gap; cur_i < sort.arr.length; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i - gap;
            
                while (i >= 0 && sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + gap, i);
                
                    i-= gap;
                
                }
    
                if (i+1 !== cur_i) await sort.write.write(i+gap,replace);
            
            }

        }
    },
    name: "Shell Sort"
}

sorts.binary_shell = {
    run: async function () {

        sort.set_delay(20000/Math.pow(sort.arr.length,2));

        let gap = sort.arr.length;

        while (gap > 1) {

            gap = Math.ceil((gap / 2) - 1);

            async function binary_search (l, r, search,offset) {
    
                if (l >= r) return l + offset;
    
                let search_i = Math.floor(((r+l)/gap)/2) * gap;
    
                if (await sort.compareind.less_eq(search_i+offset,search)) return await binary_search(search_i+gap,r,search,offset);
                else return await binary_search(l,search_i,search,offset);
                
            }
    
            for (let cur_i = gap; cur_i < sort.arr.length; cur_i++) {
    
                let replace = sort.arr[cur_i];
    
                let i = cur_i-gap;
    
                sort.set_delay(75/Math.log2(sort.arr.length));
    
                let search_i = await binary_search(0,cur_i-(cur_i%gap),cur_i,cur_i%gap);
    
                sort.set_delay(50/sort.arr.length);
            
                while (i >= search_i) {
                
                    await sort.write.overwrite(i+gap, i);
                
                    i -= gap;
                
                }
    
                if (i !== cur_i) await sort.write.write(search_i,replace);
            
            }

        }
    },
    name: "Binary Shell Sort"
}