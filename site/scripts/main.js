class Sort {

    arr;

    delay = 15;

    values = {
        compares: 0,
        swaps: 0,
        reversals: 0,
        writes: 0,
        writes_aux: 0,
        reset: function () {
            for (const v of Object.keys(this)) {
                if (!["parent","reset","temp","temp_reset","reload"].includes(v)) this[v] = 0;
            }
            this.parent.update();
        },
        temp_reset: function () {
            this.temp = {};
            for (const v of Object.keys(this)) {
                if (!["parent","reset","temp","temp_reset","reload"].includes(v)) this.temp[v] = this[v];
            }
            this.reset();
        },
        reload: function () {
            for (const v of Object.keys(this.temp)) {
                this[v] = this.temp[v];
            }
            delete this.temp;
            this.parent.update();
        }
    }

    update = function () {};

    queue = [];

    interval = [];

    time_paused = 0;

    paused = true;

    cancelled = false;

    set_delay = async function (delay) {

        if (typeof delay === "number") this.delay = delay;
        if (this.paused) return;

        while (this.interval.length > 0) clearInterval(this.interval.shift());

        for (let i = 0; i < 10/Math.max(0.1,this.delay); i++) {

            this.interval.push(setInterval(() => {if (this.queue[0] && typeof this.queue[0][0] === "function") this.queue.shift()[0]()},Math.max(10,this.delay)));

        }

    }

    stop = function () {
        this.paused = true;
        while (this.interval.length > 0) clearInterval(this.interval.shift());
    }

    start = function () {
        this.paused = false;
        this.set_delay();
    }

    end_sort = function () {

        if (this.cancelled) return;
        if (!this.running_sort) return;

        this.cancelled = true;

        while (this.interval.length > 0) clearInterval(this.interval.shift());

        this.paused = true;

        this.arr.pointers.forEach((v,i) => {this.arr.pointers[i] = false});
        this.arr.forEach((v,i) => {this.update(i)});
        
        if (this.queue[0] && typeof this.queue[0][1] === "function") this.queue[0][1]();
        this.running_sort = undefined;

        this.paused = false;

        this.verify();

    }

    toggle_pause = function () {
        if (this.paused && Date.now() - this.time_paused > 10) { //this.time_paused is to prevent weird double pause stuff
            this.start();
            this.time_paused = Date.now();
        }
        else if (!this.paused && Date.now() - this.time_paused > 10) {
            this.stop();
            this.time_paused = Date.now();
        }
    }

    wait_delay = async () => {

        return new Promise((resolve,reject) => this.queue.push([resolve,reject]))

        // return new Promise(resolve => setTimeout(resolve, this.delay));
    }

    get = async function (i) {

        this.arr.pointers[i] = true;

        this.update(i);

        await this.wait_delay();

        this.arr.pointers[i] = false;

        this.update(i);

        return this.arr[i];
    }

    compare = {
        greater: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a > b;
        },
        less: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a < b;
        },
        greater_eq: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a >= b;
        },
        less_eq: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a <= b;
        },
        equal: function (a,b) {
            this.parent.values.compares++;
            this.parent.update();
            return a === b;
        },
        min: function (i, end) {
    
            let min = this.parent[i] || this.parent[0];
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (this.less(this.parent.arr[i],min)) min = this.parent.arr[i];
                i++;
            }
    
            return min;
        },
        max: function (i, end) {
    
            let max = this.parent[i] || this.parent[0];
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (this.greater(this.parent.arr[i],max)) max = this.parent.arr[i];
                i++;
            }
    
            return max;
        }
    }

    compareind = {
        greater: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] > this.parent.arr[b];
        },
        less: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] < this.parent.arr[b];
        },
        greater_eq: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] >= this.parent.arr[b];
        },
        less_eq: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] <= this.parent.arr[b];
        },
        equal: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();
            
            this.parent.values.compares++;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            this.parent.update(a);
            this.parent.update(b);

            return this.parent.arr[a] === this.parent.arr[b];
        },
        verify: async function (i, end) {
            end = Math.min(Math.floor(end || this.parent.arr.length-1),this.parent.arr.length-1);
            for (i = Math.max(Math.floor(i || 0),0); i < end; i++) if (await this.greater(i,i+1)) return false;
            return true;
        },
        min: async function (i, end) {

            i = Math.max(Math.floor(i || 0),0);
    
            let min = i;
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (await this.less(i,min)) min = i;
                i++;
            }
    
            return min;
    
        },
        max: async function (i, end) {

            i = Math.max(Math.floor(i || 0),0);
    
            let max = i;
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (await this.greater(i,max)) max = i;
                i++;
            }
    
            return max;
            
        },
        min_max: async function (i, end) {

            i = Math.max(Math.floor(i || 0),0);
    
            let min = i, max = i;
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (await this.less(i,min)) min = i;
                if (await this.greater(i,max)) max = i;
                i++;
            }
    
            return [min,max];
            
        }
    }

    write = {
        swap: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            await this.parent.wait_delay();

            this.parent.values.swaps++;
            this.parent.values.writes += 2;

            this.parent.arr.pointers[a] = false;
            this.parent.arr.pointers[b] = false;

            [this.parent.arr[a],this.parent.arr[b]] = [this.parent.arr[b],this.parent.arr[a]];

            this.parent.update(a);
            this.parent.update(b);
        },
        write: async function (a,b) {

            this.parent.arr.pointers[a] = true;

            this.parent.update(a);

            await this.parent.wait_delay();

            this.parent.values.writes++;
            this.parent.arr.pointers[a] = false;
            
            this.parent.arr[a] = b;

            this.parent.update(a);
        },
        overwrite: async function (a,b) {

            this.parent.arr.pointers[a] = true;

            this.parent.update(a);

            await this.parent.wait_delay();

            this.parent.values.writes++;
            this.parent.arr.pointers[a] = false;

            this.parent.arr[a] = this.parent.arr[b];

            this.parent.update(a);
        },
        invert: async function (start,end) {
    
            start = Math.min(Math.max(0,Math.floor(start || 0)),this.parent.arr.length-1);
            end = Math.min(Math.max(0,Math.floor(end || this.parent.arr.length-1)),this.parent.arr.length-1);
    
            this.parent.values.reversals++;
    
            for (;start <= end;await this.swap(start,end),start++,end--);
    
        },
        randomize: async function (start,end) {
    
            start = Math.min(Math.max(0,Math.floor(start || 0)),this.parent.arr.length);
            end = Math.min(Math.max(0,Math.floor(end || this.parent.arr.length)),this.parent.arr.length);
        
            let ran_i;
        
            for (let cur_i = start; cur_i < end; cur_i++) {
        
                ran_i = cur_i + Math.floor(Math.random() * (end - cur_i));
                
                await this.swap(cur_i,ran_i);
        
            }
            
        }
    }

    shuffle_type = 0;

    constructor (length, update, finish_func, shuffle) {

        length = Math.min(Math.max(Math.round(length || 128),4),512);

        this.shuffle_type = shuffle || 0;

        if (this.shuffle_type != 6) this.arr = Array.from({length}, (v, i) => i + 1);
        else {

            this.arr = Array.from({length});

            let bucket_size = Math.ceil(length/16);
    
            for (let i = 0; i < length; i++) {
                this.arr[i] = Math.ceil(i/bucket_size)*bucket_size;
            }

        }

        this.arr.pointers = this.arr.map(() => {return false})

        for (const v of Object.keys(this)) {
            if (typeof this[v] == "object") this[v].parent = this;
        }

        this.update = update(this.arr,this.values);

        this.arr.forEach((v,i) => {this.update(i)});

        this.finish_func = finish_func;

    }

    initiate = function (func) {
        this.running_sort = func;
        this.running_sort().then(() => {this.end_sort()}).catch((e)=>{
            if (!this.cancelled) console.error(e);
        })
        this.start();
    }

    shuffle = async function () {

        this.set_delay(1500 / this.arr.length);

        this.start();

        switch (this.shuffle_type) {

            default: //Random
                
                await this.write.randomize();

                break;

            case 0: //Random
                
                await this.write.randomize();

                break;

            case 1: //Sorted

                break;

            case 2: //Reversed

                await this.write.invert();

                break;

            case 3: //Heapified

                this.set_delay(1000/(this.arr.length*Math.log2(this.arr.length)));

                for (let i = 0; i <= this.arr.length - 1; i++) {
    
                    let parent = Math.floor((i-1)/2);
    
                    let cur_i = i;
    
                    while (parent >= 0 && await this.compareind.greater(cur_i,parent)) {
    
                        await this.write.swap(cur_i,parent);
                        cur_i = parent;
                        parent = Math.floor((cur_i-1)/2);
    
                    }
    
                }

                break;

            case 4: //Mostly combed

                this.set_delay(1000 / this.arr.length);
                
                await this.write.randomize(); //Randomize, then comb

                this.set_delay(1000/(this.arr.length*Math.log2(this.arr.length)));
        
                let gap = this.arr.length;
        
                while (gap > Math.max(16,this.arr.length * 0.125)) {
        
                    if (gap > 1) gap = Math.floor(gap / 1.3);
        
                    for (let i = 0; i < this.arr.length - gap; i++) {
        
                        if (await this.compareind.greater(i, i + gap)) await this.write.swap(i, i + gap);
        
                    }
                
                }

                break;

            case 5: //Random numbers

                for (let i = 0; i < this.arr.length; i++) {
                    await this.write.write(i,Math.random() * this.arr.length);
                }

                break;

            case 6: //Many similar
                
                await this.write.randomize();

                break;
        }

        this.stop();

        this.values.reset();
        
    }

    verify = async function () {

        this.values.temp_reset();

        this.set_delay(750 / this.arr.length);

        this.arr.verifying = true;

        this.arr.verified = true;

        for (let i = 0; i < this.arr.length-1; i++) {
            if (await this.compareind.greater(i,i+1)) this.arr.verified = false;
        }

        await this.wait_delay();

        if (!this.arr.verified) alert("Sort failed!");
        
        this.arr.verifying = false;

        this.stop();

        this.values.reload();

        this.arr.forEach((v,i) => {this.update(i)});

        this.finish_func();

    }

}