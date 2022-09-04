sorts.merge = {
    run: async function () {

        sort.set_delay(20000/(sort.arr.length*Math.log2(sort.arr.length)));

        async function merge ([l1,r1],[l2,r2]) {

            let merged = [];

            let lpoint = l1, rpoint = l2;

            while (lpoint <= r1 || rpoint <= r2) {

                if (lpoint > r1) {
                    while (rpoint <= r2) {
                        merged.push(await sort.get(rpoint));
                        sort.values.writes_aux++;
                        rpoint++;
                    }
                    break;
                }
                else if (rpoint > r2) {
                    while (lpoint <= r1) {
                        merged.push(await sort.get(lpoint));
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

sorts.bottomup_merge = {
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
}