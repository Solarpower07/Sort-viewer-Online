sorts.merge = {
    run: async function () {

        sort.set_delay(20000/(sort.arr.length*Math.log2(sort.arr.length)));

        let aux_arr = [...sort.arr];

        async function merge ([l1,r1],[l2,r2]) {

            let lpoint = l1, rpoint = l2, pos = l1;

            while (lpoint <= r1 || rpoint <= r2) {

                if (lpoint > r1) {
                    while (rpoint <= r2) {
                        aux_arr[pos] = await sort.get(rpoint);
                        sort.values.writes_aux++;
                        rpoint++;
                        pos++;
                    }
                    break;
                }
                else if (rpoint > r2) {
                    while (lpoint <= r1) {
                        aux_arr[pos] = await sort.get(lpoint);
                        sort.values.writes_aux++;
                        lpoint++;
                        pos++;
                    }
                    break;
                }
            
                if (await sort.compareind.greater(lpoint,rpoint)) {
                    aux_arr[pos] = sort.arr[rpoint];
                    rpoint++;
                    pos++;
                }
                else {
                    aux_arr[pos] = sort.arr[lpoint];
                    lpoint++;
                    pos++;
                }

                sort.values.writes_aux++;

            }

            for (let i = l1; i <= r2; i++) {
                await sort.write.write(i,aux_arr[i]);
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
    name: "Merge Sort"
}

sorts.bottomup_merge = {
    run: async function () {

        sort.set_delay(10000/(sort.arr.length*Math.log2(sort.arr.length)));

        let aux_arr = [...sort.arr];

        async function merge ([l1,r1],[l2,r2]) {

            let lpoint = l1, rpoint = l2, pos = l1;

            while (lpoint <= r1 || rpoint <= r2) {

                if (lpoint > r1) {
                    while (rpoint <= r2) {
                        aux_arr[pos] = await sort.get(rpoint);
                        sort.values.writes_aux++;
                        rpoint++;
                        pos++;
                    }
                    break;
                }
                else if (rpoint > r2) {
                    while (lpoint <= r1) {
                        aux_arr[pos] = await sort.get(lpoint);
                        sort.values.writes_aux++;
                        lpoint++;
                        pos++;
                    }
                    break;
                }
            
                if (await sort.compareind.greater(lpoint,rpoint)) {
                    aux_arr[pos] = sort.arr[rpoint];
                    rpoint++;
                    pos++;
                }
                else {
                    aux_arr[pos] = sort.arr[lpoint];
                    lpoint++;
                    pos++;
                }

                sort.values.writes_aux++;

            }

            return [l1,r2];
        
        }

        for (let i = 2; i <= sort.arr.length; i *= 2) {

            for (let x = 0; x < sort.arr.length; x += i) {
                let endpoint = Math.min(x+i-1,sort.arr.length-1);
                let midpoint = Math.floor((x + endpoint) / 2);
                await merge([x,midpoint],[midpoint+1,endpoint]);
            }

            for (let i = 0; i < aux_arr.length; i++) {
                await sort.write.write(i,aux_arr[i]);
            }

        }

    },
    name: "Bottom-up Merge Sort"
}

sorts.rotate_merge = {
    run: async function () {

        sort.set_delay(4500/sort.arr.length);

        async function binary_search (l, r, search) {

            if (l >= r) return l;

            let search_i = Math.floor((r+l)/2);

            if (await sort.compareind.less_eq(search_i,search)) return await binary_search(search_i+1,r,search);
            else return await binary_search(l,search_i,search);
            
        }

        async function recursive (l,r,m) {

            let ml = m, mr = m+1;

            let [lenl,lenr] = [ml-l,r-mr];

            if (lenl < 1 || lenr < 1) return;

            if (lenl >= lenr) {

                let mid = Math.floor(lenl/2)+l+1;

                let i = await binary_search(mr,r,mid);

                console.log(l,r,m,mid,i,i-mr);
                await sort.write.rotate(mid,i,i-mr);

                await recursive(mr,r,i);
                await recursive(l,ml,mid);


            } else {

                let mid = Math.floor(lenr/2)+mr;

                let i = await binary_search(l,ml,mid);

                // console.log(l,r,m,mid,i,mid-ml);
                await sort.write.rotate(i,mid,i-l);

                await recursive(mr,r,mid-1);
                await recursive(l,ml,i);

            }

        }

        for (let i = 256; i <= sort.arr.length; i *= 2) {

            for (let x = 0; x < sort.arr.length; x += i) {
                let r = Math.min(sort.arr.length-1,x+i);
                await recursive(x,r,Math.floor((x+r)/2));
            }

        }

        // await sort.write.rotate(0, sort.arr.length-1, 16);

    },
    name: "Rotate Merge Sort"
}