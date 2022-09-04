sorts.selection = {
    run: async function () {

        sort.set_delay(25000/Math.pow(sort.arr.length,2));

        for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

            let swap_i = await sort.compareind.min(cur_i);
        
            if (await sort.compareind.equal(swap_i, cur_i)) continue;
        
            await sort.write.swap(cur_i, swap_i);
        
        }

    },
    name: "Selection Sort"
}

sorts.cycle = {
    run: async function () {

        sort.set_delay(8000/Math.pow(sort.arr.length,2));

        async function smaller (index,compare,ind) {
        
            let count = index;

            for (let i = index + 1; i < sort.arr.length; i++) {
                await sort.compareind.equal(i,ind);
                if (i < ind && sort.arr[i] === compare) console.log(i,ind,true);
                if (i >= ind && sort.arr[i] === compare) console.log(i,ind,false);
                if (i < ind ? sort.arr[i] <= compare : sort.arr[i] < compare) count++;
            }
        
            return count;
        
        }

        for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

            let ind = await smaller(cur_i,sort.arr[cur_i],cur_i), cur_val = await sort.get(cur_i), changed = false;
        
            while (ind > cur_i) {
                let temp = sort.arr[ind];
                await sort.write.write(ind, cur_val);
                cur_val = temp;
                ind = await smaller(cur_i,cur_val,ind);
                changed = true;
            }
            
            if (changed) await sort.write.write(cur_i,cur_val);
        
        }

    },
    name: "Cycle Sort",
    require_int: true
}

sorts.pigeonhole_cycle = {
    run: async function () {

        sort.set_delay(3000/sort.arr.length);

        let min = 0;

        for (let i = 0; i <= sort.arr.length; i++) {
            if (sort.arr[i] < min) min = sort.arr[i];
        }

        for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

            let ind = sort.arr[cur_i] - min, cur_val = await sort.get(cur_i), changed = false;
        
            while (ind > cur_i) {
                let temp = sort.arr[ind];
                await sort.write.write(ind, cur_val);
                cur_val = temp;
                ind = cur_val - min;
                changed = true;
            }
            
            if (changed) await sort.write.write(cur_i,cur_val);
        
        }

    },
    name: "Pigeonhole-Cycle Hybrid Sort",
    require_int: true
}

sorts.maxheap = {
    run: async function () {

        sort.set_delay(3500/(sort.arr.length*Math.log2(sort.arr.length)));

        let end = sort.arr.length-1;

        async function heapify (i) {

            let children = [(i*2)+1,(i*2)+2];
    
            while (children[0] <= end && (await sort.compareind.less(i,children[0]) || (children[1] <= end ? await sort.compareind.less(i,children[1]) : false))) {
            
                let greater = (children[1] <= end && await sort.compareind.less(...children)) ? children[1] : children[0];
                await sort.write.swap(i,greater);
                i = greater;
                children = [(i*2)+1,(i*2)+2];
            
            }

        }

        //Initial heapify
        for (let i = end; i >= 0; i--) {
            
            await heapify(i);

        }

        sort.set_delay(5500/(sort.arr.length*Math.log2(sort.arr.length)));

        while (end > 0) {
            await sort.write.swap(0,end);
            end--;
            await heapify(0);
        }

    },
    name: "Max Heap Sort"
}

sorts.minheap = {
    run: async function () {

        sort.set_delay(3500/(sort.arr.length*Math.log2(sort.arr.length)));

        let end = sort.arr.length-1;

        async function heapify (i) {

            let children = [(i*2)+1,(i*2)+2];
    
            while (children[0] <= end && (await sort.compareind.greater(i,children[0]) || (children[1] <= end ? await sort.compareind.greater(i,children[1]) : false))) {
            
                let greater = (children[1] <= end && await sort.compareind.greater(...children)) ? children[1] : children[0];
                await sort.write.swap(i,greater);
                i = greater;
                children = [(i*2)+1,(i*2)+2];
            
            }

        }

        //Initial heapify
        for (let i = end; i >= 0; i--) {
            
            await heapify(i);

        }

        sort.set_delay(5500/(sort.arr.length*Math.log2(sort.arr.length)));

        while (end > 0) {
            await sort.write.swap(0,end);
            end--;
            await heapify(0);
        }

        sort.set_delay(1500/sort.arr.length);

        await sort.write.invert();

    },
    name: "Min Heap Sort"
}