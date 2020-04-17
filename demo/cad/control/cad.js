class Cad extends AdvancedCustomControl {
    // Declare private Variable
    #data = false;
    // Initialize the Layer
    constructor(id) {
      // Initialize CustomControl superClass
      super(id);
    }

    setData (data) {
        if (!this.#data) {
            this.#data = data;
            console.log(data);
            this.appendSelect('dep-select', data.departements, false);
            document.getElementById('dep-select').addEventListener("change", this.onDptChange.bind(this), false);
        }
    }

    appendSelect (select, data, remove) {
        let element  = document.getElementById(select);
        if (remove) {
            let options = element.getElementsByTagName("option");

            Array.from(options).forEach(function (item, index) {
                element.remove(index);
            });
        }
        data.forEach(function(item) {
            let option = document.createElement("option");
            option.text = item.label;
            option.value = item.value;
            element.add(option);
        })
    }

    onDptChange (e) {
        let selectedDpt = e.target.value;
        let data = this.#data.departements.filter(dpt => dpt.value === selectedDpt)[0];
        console.log(data);
        this.appendSelect('com-select', data.communes, true);
    }


    // Mandatory - code executed when panel is opened
    init() {
      console.log('init cad');
      const that = this;
      if (!this.#data) {
        fetch('demo/cad/data/data.json')
        .then(function (response) {
            response.json()
                .then(function (data) {
                    that.setData(data);
                });
        });
      }

    }
    // Mandatory - code executed when panel is closed
    destroy() {
        console.log('destroy');
    }

  }
  // Create The CustomControl
  new Cad("cad");