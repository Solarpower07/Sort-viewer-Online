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

        sort.set_delay(15000/Math.pow(sort.arr.length,2));

        async function smaller (index) {

            const compare_val = index;
        
            let count = 0;

            for (let i = index + 1; i < sort.arr.length; i++) {
                if (await sort.compareind.less(i,compare_val)) count++;
            }
        
            return count;
        
        }

        for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

            let amnt_smaller = await smaller(cur_i);
        
            while (sort.compare.greater(amnt_smaller+cur_i, cur_i)) {
                await sort.write.swap(amnt_smaller+cur_i, cur_i);
                amnt_smaller = await smaller(cur_i);
            }
        
        }

    },
    name: "Cycle Sort"
}

sorts.maxheap = {
    run: async function () {

        sort.set_delay(2500/(sort.arr.length*Math.log2(sort.arr.length)));

        let end = sort.arr.length-1;

        //Initial heapify
        for (let i = 0; i <= end; i++) {

            let parent = Math.floor((i-1)/2);

            let cur_i = i;

            while (parent >= 0 && await sort.compareind.greater(cur_i,parent)) {

                await sort.write.swap(cur_i,parent);
                cur_i = parent;
                parent = Math.floor((cur_i-1)/2);

            }

        }

        sort.set_delay(7500/(sort.arr.length*Math.log2(sort.arr.length)));

        async function heapify () {
    
            let i = 0;

            let children = [(i*2)+1,(i*2)+2];
    
            while (children[0] <= end && (await sort.compareind.less(i,children[0]) || (children[1] <= end ? await sort.compareind.less(i,children[1]) : false))) {
            
                let greater = (children[1] <= end && await sort.compareind.less(...children)) ? children[1] : children[0];
                await sort.write.swap(i,greater);
                i = greater;
                children = [(i*2)+1,(i*2)+2];
            
            }

        }

        while (end > 0) {
            await sort.write.swap(0,end);
            end--;
            await heapify();
        }

    },
    name: "Max Heap Sort"
}

sorts.minheap = {
    run: async function () {

        sort.set_delay(2500/(sort.arr.length*Math.log2(sort.arr.length)));

        let end = sort.arr.length-1;

        //Initial heapify
        for (let i = 0; i <= end; i++) {

            let parent = Math.floor((i-1)/2);

            let cur_i = i;

            while (parent >= 0 && await sort.compareind.less(cur_i,parent)) {

                await sort.write.swap(cur_i,parent);
                cur_i = parent;
                parent = Math.floor((cur_i-1)/2);

            }

        }

        sort.set_delay(7500/(sort.arr.length*Math.log2(sort.arr.length)));

        async function heapify () {
    
            let i = 0;

            let children = [(i*2)+1,(i*2)+2];
    
            while (children[0] <= end && (await sort.compareind.greater(i,children[0]) || (children[1] <= end ? await sort.compareind.greater(i,children[1]) : false))) {
            
                let greater = (children[1] <= end && await sort.compareind.greater(...children)) ? children[1] : children[0];
                await sort.write.swap(i,greater);
                i = greater;
                children = [(i*2)+1,(i*2)+2];
            
            }

        }

        while (end > 0) {
            await sort.write.swap(0,end);
            end--;
            await heapify();
        }

        sort.set_delay(1500/sort.arr.length);

        await sort.write.invert();

    },
    name: "Min Heap Sort"
}