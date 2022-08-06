const sorts = {
    bubble: async function () {

        sort.set_delay(1);
    
        for (let max = 0; max < sort.arr.length; max++) {
    
            for (let cur_i = 0; cur_i < sort.arr.length - max - 1; cur_i++) {
    
                if (await sort.compareind.greater(cur_i,cur_i+1)) await sort.write.swap(cur_i,cur_i+1);
    
            }
    
        }
    
    },
    cocktail: async function () {

        sort.set_delay(1);

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
    quick: async function () {

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

        sort.set_delay(1);

        await recursive(0, sort.arr.length - 1);

    },

    gnome: async function () {

        sort.set_delay(1);

        for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

            let swap_i = cur_i;
    
            while (swap_i > 0 && await sort.compareind.less(swap_i, swap_i - 1)) {
    
                await sort.write.swap(swap_i, swap_i - 1);
    
                swap_i--;
    
            }
    
        }
    },

    cycle: async function () {

        sort.set_delay(1);

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

    selection: async function () {

        sort.set_delay(1);

        for (let cur_i = 0; cur_i < sort.arr.length; cur_i++) {

            let swap_i = await sort.compareind.min(cur_i);
    
            if (await sort.compareind.equal(swap_i, cur_i)) continue;
    
            await sort.write.swap(cur_i, swap_i);
    
        }

    },

    merge: async function () {

        sort.set_delay(1);

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

    }
}