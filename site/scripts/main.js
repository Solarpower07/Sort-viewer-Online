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

    paused = true;

    set_delay = async function (delay) {

        if (typeof delay === "number") this.delay = delay;
        if (this.paused) return;

        while (this.interval.length > 0) clearInterval(this.interval.shift());

        for (let i = 0; i < 10/Math.max(0.1,this.delay); i++) {

            // const _time = performance.now();

            this.interval.push(setInterval(() => {if (this.queue[0] && typeof this.queue[0][0] === "function") this.queue.shift()[0]()},10));
    
            // console.log((performance.now() - _time).toFixed(1));

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
        while (this.interval.length > 0) clearInterval(this.interval.shift());
        this.paused = true;
        this.arr.pointers.forEach((v,i) => {this.arr.pointers[i] = false});
        this.arr.forEach((v,i) => {this.update(i)});
        if (this.running_sort) {
            if (this.queue[0] && typeof this.queue[0][1] === "function") this.queue[0][1]();
            this.running_sort = undefined;
        }
        this.paused = false;
        this.verify();
    }

    toggle_pause = function () {
        if (this.paused) this.start();
        else this.stop();
    }

    wait_delay = async () => {

        return new Promise((resolve,reject) => this.queue.push([resolve,reject]))

        // return new Promise(resolve => setTimeout(resolve, this.delay));
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
            for (i = Math.max(i || 0,0); i < Math.min(end || this.parent.arr.length-1,this.parent.arr.length-1); i++) if (await this.greater(i,i+1)) return false;
            return true;
        },
        min: async function (i, end) {
    
            let min = i || 0;
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (await this.less(i,min)) min = i;
                i++;
            }
    
            return min;
    
        },
        max: async function (i, end) {
    
            let max = i || 0;
            end = Math.min((end || this.parent.arr.length - 1),this.parent.arr.length - 1);
    
            while (i <= end) {
                if (await this.greater(i,max)) max = i;
                i++;
            }
    
            return max;
            
        }
    }

    write = {
        swap: async function (a,b) {

            this.parent.arr.pointers[a] = true;
            this.parent.arr.pointers[b] = true;

            this.parent.update(a);
            this.parent.update(b);

            const _time = performance.now();

            await this.parent.wait_delay();

            console.log((performance.now() - _time).toFixed(1),this.parent.delay);

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

            this.parent.set_delay(1000 / this.parent.arr.length);
    
            start = Math.min(Math.max(0,Math.floor(start || 0)),this.parent.arr.length-1);
            end = Math.min(Math.max(0,Math.floor(end || this.parent.arr.length-1)),this.parent.arr.length-1);
    
            this.parent.values.reverses++;
    
            for (;start <= end;await this.swap(start,end),start++,end--);
    
        }
    }

    constructor (length, update) {

        this.arr = Array.from({length}, (v, i) => i + 1);

        this.arr.pointers = this.arr.map(() => {return false})

        for (const v of Object.keys(this)) {
            if (typeof this[v] == "object") this[v].parent = this;
        }

        this.update = update(this.arr,this.values);

        this.arr.forEach((v,i) => {this.update(i)});

    }

    initiate = function (func) {
        this.running_sort = func;
        this.running_sort().then(() => {this.end_sort()}).catch(()=>{})
    }

    shuffle = async function () {

        this.set_delay(1000 / this.arr.length);

        this.start();
    
        let ran_i;
    
        for (let cur_i = 0; cur_i < this.arr.length; cur_i++) {
    
            ran_i = cur_i + Math.floor(Math.random() * (this.arr.length - cur_i));
            
            await this.write.swap(cur_i,ran_i);
    
        }
        
    }

    verify = async function () {

        this.values.temp_reset();

        this.set_delay(1000 / this.arr.length);

        this.arr.verifying = true;

        this.arr.verified = true;

        for (let i = 0; i < this.arr.length-1; i++) {
            if (await this.compareind.greater(i,i+1)) this.arr.verified = false;
        }

        await this.wait_delay();

        if (!this.arr.verified) alert("Sort failed!");
        
        this.arr.verifying = false;

        this.values.reload();

        this.arr.forEach((v,i) => {this.update(i)});

    }

}