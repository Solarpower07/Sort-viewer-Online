sorts.bubble = {
    run: async function () {

        sort.set_delay(10000/Math.pow(sort.arr.length,2));
        
        for (let max = 0; max < sort.arr.length; max++) {
        
            for (let cur_i = 0; cur_i < sort.arr.length - max - 1; cur_i++) {
            
                if (await sort.compareind.greater(cur_i,cur_i+1)) await sort.write.swap(cur_i,cur_i+1);
            
            }
        
        }

    },
    name: "Bubble Sort"
}

sorts.optimized_bubble = {
    run: async function () {

        sort.set_delay(10000/Math.pow(sort.arr.length,2));

        let concurrent = 1;
        
        for (let max = sort.arr.length - 1; max > 0; max -= concurrent) {
        
            for (let cur_i = 0; cur_i < max; cur_i++) {
            
                if (await sort.compareind.greater(cur_i,cur_i+1)) {
                    await sort.write.swap(cur_i,cur_i+1);
                    concurrent = 1;
                } else concurrent++;
            
            }
        
        }

    },
    name: "Optimized Bubble Sort"
}

sorts.cocktail = {
    run: async function () {

        sort.set_delay(10000/Math.pow(sort.arr.length,2));

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
}

sorts.optimized_cocktail = {
    run: async function () {

        sort.set_delay(10000/Math.pow(sort.arr.length,2));

        let lpoint = 0, rpoint = sort.arr.length - 1;

        while (lpoint <= rpoint) {
        
            let cur_i;

            let concurrent = 1;
        
            for (cur_i = lpoint; cur_i < rpoint; cur_i++) {
            
                if (await sort.compareind.greater(cur_i,cur_i+1)) {
                    await sort.write.swap(cur_i,cur_i+1);
                    concurrent = 1;
                } else concurrent++;
            
            }

            rpoint -= concurrent;

            concurrent = 1;
        
            for (cur_i = rpoint; cur_i > lpoint; cur_i--) {
            
                if (await sort.compareind.less(cur_i,cur_i-1)) {
                    await sort.write.swap(cur_i,cur_i-1);
                    concurrent = 1;
                } else concurrent++;
            
            }

            lpoint += concurrent;

        }
        
    },
    name: "Optimized Cocktail Shaker Sort"
}

sorts.gnome = {
    run: async function () {

        sort.set_delay(25000/Math.pow(sort.arr.length,2));

        for (let cur_i = 1; cur_i < sort.arr.length; cur_i++) {

            let swap_i = cur_i;
        
            while (swap_i > 0 && await sort.compareind.less(swap_i, swap_i - 1)) {
            
                await sort.write.swap(swap_i, swap_i - 1);
            
                swap_i--;
            
            }
        
        }
    },
    name: "Gnome Sort"
}

sorts.quick = {
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
}

sorts.quick_random = {
    run: async function () {

        sort.set_delay(20000/(sort.arr.length*Math.log2(sort.arr.length)));

        async function partition (l,r) {
        
            let pivot = Math.floor(Math.random() * (r - l + 1));
        
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
    name: "Quick Sort, L/R Pointers, Random Pivot"
}

sorts.stable_quick = {
    run: async function () {

        sort.set_delay(2000/(sort.arr.length*Math.log2(sort.arr.length)));

        async function partition (l,r) {
        
            let pivot = Math.floor((r + l) / 2);

            let aux_l = [], aux_r = [];

            for (let i = l; i <= r; i++) {

                if (i == pivot) continue;

                let v = sort.arr[i];

                if (i < pivot && await sort.compareind.less_eq(i, pivot)) aux_l.push(v);
                else if (i > pivot && await sort.compareind.less(i,pivot)) aux_l.push(v);
                else aux_r.push(v);

                sort.values.writes_aux++;

            }

            let combined = [...aux_l,sort.arr[pivot],...aux_r];

            for (let i = 0; i < combined.length; i++) {
                await sort.write.write(l+i,combined[i]);
            }
        
            return l + aux_l.length;
        
        }

        async function recursive (l,r) {
        
            let i = await partition(l,r);
        
            if (l < i - 1) {
                await recursive(l,i);
            }
        
            if (r > i) {
                await recursive(i+1,r);
            }
        
        }

        await recursive(0, sort.arr.length - 1);

    },
    name: "Stable Quick Sort"
}

sorts.oddeven = {
    run: async function () {

        sort.set_delay(5000/Math.pow(sort.arr.length,2));

        let sorted = false;

        while (!sorted) {

            sorted = true;
        
            let cur_i;
        
            for (cur_i = 1; cur_i < sort.arr.length - 1; cur_i += 2) {
            
                if (await sort.compareind.greater(cur_i,cur_i+1)) {
                    await sort.write.swap(cur_i,cur_i+1);
                    sorted = false;
                }
            
            }
        
            for (cur_i = 0; cur_i < sort.arr.length - 1; cur_i += 2) {
            
                if (await sort.compareind.greater(cur_i,cur_i+1)) {
                    await sort.write.swap(cur_i,cur_i+1);
                    sorted = false;
                }
            
            }
        
        }
    },
    name: "Odd-Even Sort"
}

sorts.comb = {
    run: async function () {

        sort.set_delay(10000/(sort.arr.length*Math.log2(sort.arr.length)));

        let gap = sort.arr.length;

        let swapped = true;

        while (gap > 1 || swapped) {

            swapped = false;
        
            if (gap > 1) gap = Math.floor(gap / 1.3);

            for (let i = 0; i < sort.arr.length - gap; i++) {

                if (await sort.compareind.greater(i, i + gap)) {
                    await sort.write.swap(i, i + gap);
                    swapped = true;
                }

            }
        
        }
    },
    name: "Comb Sort"
}