const sorts = {
    bubble: {
        run: async function () {

            sort.set_delay(15000/Math.pow(sort.arr.length,2));
            
            for (let max = 0; max < sort.arr.length; max++) {
            
                for (let cur_i = 0; cur_i < sort.arr.length - max - 1; cur_i++) {
                
                    if (await sort.compareind.greater(cur_i,cur_i+1)) await sort.write.swap(cur_i,cur_i+1);
                
                }
            
            }
    
        },
        name: "Bubble Sort"
    },
    cocktail: {
        run: async function () {

            sort.set_delay(15000/Math.pow(sort.arr.length,2));

            for (let max = 0; max < sort.arr.length / 2; max++) {
            
                let cur_i;
            
                for (cur_i = max; cur_i < sort.arr.length - max - 1; cur_i++) {
                
                    if (await sort.compareind.greater(cur_i,cur_i+1)) await sort.write.swap(cur_i,cur_i+1);
                
                }
            
                for (; cur_i > max; cur_i--) {
                
                    if (await sort.compareind.less(cur_i,cur_i-1)) await sort.write.swap(cur_i,cur_i-1);
                
                }
            
            }
        },
    name: "Cocktail Shaker Sort"
    },
    quick: {
        run: async function () {

            sort.set_delay(20000/(sort.arr.length*Math.log2(sort.arr.length)));

            async function partition (l,r) {
            
                let pivot = Math.floor((r + l) / 2);
            
                let lpoint = l;
            
                let rpoint = r;
            
                while (lpoint <= rpoint) {
                
                    //Find out-of-place elements
                    while (await sort.compareind.less(lpoint,pivot)) {
                        lpoint++;
                    }
                    while (await sort.compareind.greater(rpoint,pivot)) {
                        rpoint--;
                    }
                
                    if (lpoint <= rpoint) {
                    
                        await sort.write.swap(lpoint,rpoint);

                        if (lpoint === pivot) pivot = rpoint;

                        else if (rpoint === pivot) pivot = lpoint;
                    
                        lpoint++;
                        rpoint--;
                    }

                }
            
                return lpoint;
            
            }

            async function recursive (l,r) {
            
                let i = await partition(l,r);
            
                if (l < i - 1) {
                    await recursive(l,i-1);
                }
            
                if (r > i) {
                    await recursive(i,r);
                }
            
            }

            await recursive(0, sort.arr.length - 1);

        },
        name: "Quick Sort, L/R Pointers"
    },
    gnome: {
        run: async function () {

            sort.set_delay(30000/Math.pow(sort.arr.length,2));

            for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {

                let swap_i = cur_i;
            
                while (swap_i > 0 && await sort.compareind.less(swap_i, swap_i - 1)) {
                
                    await sort.write.swap(swap_i, swap_i - 1);
                
                    swap_i--;
                
                }
            
            }
        },
        name: "Gnome Sort"
    },
    insertion: {
        run: async function () {

            sort.set_delay(30000/Math.pow(sort.arr.length,2));

            for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {

                let replace = sort.arr[cur_i];

                let i = cur_i - 1;
            
                while (i >= 0 && await sort.compare.less(replace, await sort.get(i))) {
                
                    await sort.write.overwrite(i + 1, i);
                
                    i--;
                
                }

                await sort.write.write(i+1,replace);
            
            }
        },
        name: "Insertion Sort"
    },
    cycle: {
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
    },
    selection: {
        run: async function () {

            sort.set_delay(25000/Math.pow(sort.arr.length,2));

            for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

                let swap_i = await sort.compareind.min(cur_i);
            
                if (await sort.compareind.equal(swap_i, cur_i)) continue;
            
                await sort.write.swap(cur_i, swap_i);
            
            }

        },
        name: "Selection Sort"
    },
    merge: {
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
    },
    bottomup_merge: {
        run: async function () {

            sort.set_delay(20000/(sort.arr.length*Math.log2(sort.arr.length)) * 10);

            let aux_arr = Array.from({length: sort.arr.length});

            async function merge ([l1,r1],[l2,r2]) {

                let lpoint = l1, rpoint = l2;

                point_aux = l1;

                while (lpoint <= r1 || rpoint <= r2) {

                    if (lpoint > r1) {
                        while (rpoint <= r2) {
                            aux_arr[point_aux] = sort.arr[rpoint];
                            point_aux++;
                            sort.values.writes_aux++;
                            rpoint++;
                        }
                        break;
                    }
                    else if (rpoint > r2) {
                        while (lpoint <= r1) {
                            aux_arr[point_aux] = sort.arr[lpoint];
                            point_aux++;
                            sort.values.writes_aux++;
                            lpoint++;
                        }
                        break;
                    }
                
                    if (await sort.compareind.greater_eq(lpoint,rpoint)) {
                        aux_arr[point_aux] = sort.arr[rpoint];
                        point_aux++;
                        rpoint++;
                    }
                    else {
                        aux_arr[point_aux] = sort.arr[lpointpoint];
                        point_aux++;
                        lpoint++;
                    }

                    sort.values.writes_aux++;

                }

                return [l1,r2];
            
            }

            async function recursive (l,r) {
            
                if (r-l < 1) return [l,r];
            
                let i = Math.floor((r + l) / 2);
            
                return await merge(await recursive(l,i),await recursive(i+1,r));
            
            }

            await recursive(0, sort.arr.length-1);

        },
        name: "Bottom-up Merge Sort"
    },
    stooge: {
        run: async function () {

            sort.set_delay(5000/Math.pow(sort.arr.length,2.7));

            async function recursive (l,r) {

                if (r-l <= 1) {
                    if (await sort.compareind.greater(l,r)) await sort.write.swap(l,r);
                    return;
                }
            
                let i = [Math.round((l+2*r)/3),Math.round((2*l+r)/3)];
                
                await recursive(l,i[0]);
                await recursive(i[1],r);
                await recursive(l,i[0]);
            
            }

            await recursive(0, sort.arr.length - 1);

        },
        name: "Stooge Sort"
    },
    bogo: {
        run: async function () {

            sort.set_delay(0.1);
            
            while (!await sort.compareind.verify()) {
                await sort.write.randomize();
            }

        },
        name: "Bogo Sort"
    },
    maxheap: {
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
    },
    minheap: {
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
    },
    pigeonhole: {
        run: async function () {

            sort.set_delay(2000/sort.arr.length);
    
            let min = 0, max = 0;
    
            for (let i = 0; i <= sort.arr.length; i++) {
                if (sort.arr[i] < sort.arr[min]) min = i;
                if (sort.arr[i] > sort.arr[max]) max = i;
            }

            let holes = Array.from({length: sort.arr[max] - sort.arr[min] + 1});

            for (let i = 0; i < sort.arr.length; i++) {
                holes[await sort.get(i) - sort.arr[min]] = sort.arr[i];
                sort.values.writes_aux++;
            }

            for (let i = 0; i < holes.length; i++) {
                await sort.write.write(i,holes[i]);
            }

        },
        name: "Pigeonhole Sort"
    },
}