sorts.insertion = {
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
}