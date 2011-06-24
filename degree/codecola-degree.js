/**
 * a degree control for css3 property
 * @class codecola-degree
 * @constructor
 * @namespace Y.codecolaDegree
 * @extends Widget
 * @requires node widget codecola-degree-css
 */
YUI().add('codecola-degree', function(Y) {
    Y.codecolaDegree = Y.Base.create('codecola-degree', Y.Widget, [], {
        initializer: function() {
        },

        renderUI: function() {
            var that = this;
            that.vars = {
                'degreeWrap' : Y.Node.create('<div class="codecola-degree-wrap"></div>'),
                'degree' : Y.Node.create('<div class="codecola-degree"></div>'),
                'line' : Y.Node.create('<i class="codecola-degree-line"></i>'),
                'dot' : Y.Node.create('<b class="codecola-degree-dot"></b>'),
                'label' : Y.Node.create('<label class="codecola-degree-label"></label>'),
                'input' : Y.Node.create('<input type="number" class="codecola-degree-input" step="1" max="180" min="-180">')
            };
            var val = that.vars,
                degreeWrap = val.degreeWrap,
                degree = val.degree,
                line = val.line,
                dot = val.dot,
                label = val.label,
                input = val.input;

            degree.append(line).append(dot);
            label.append(input).append(Y.Node.create('度'));
            degreeWrap.append(degree).append(label);
            Y.one(that.get('wrap')).append(degreeWrap);

            return that;
        },

        bindUI: function() {
            var that = this,
                drag = false,
                vars = that.vars,
                doc = Y.one('html');
            vars.degree.on('click', function(e) {
                that.setDegree({
                    value: that._countDegree(e)
                });
            });
            vars.degree.on('mousedown', function(e) {
                drag = true;
                doc.setStyle('webkitUserSelect', 'none');
            });
            doc.on('mouseup', function() {
                drag = false;
                doc.setStyle('webkitUserSelect', '');
            });
            doc.on('mousemove', function(e) {
                if (!drag) {
                    return;
                }
                that.setDegree({
                    value: that._countDegree(e)
                });
            });
            vars.input.on('change', function() {
                that.setDegree({
                    value: this.get('value')
                });
            });
            return that;
        },

        syncUI: function() {
            this._initControls();
            return this;
        },

        renderer: function(){
            this.renderUI().bindUI().syncUI().get('onInit')();
            return this;
        },

        /**
         * @method _countDegree
         * @private
         * @param {Event}
         * @return {Number}
         */
        _countDegree: function(e) {
            var dot = this.vars.dot,
                dotXY = dot.getXY(),
                offset = {};

            offset.x = e.clientX - dotXY[0];
            offset.y = e.clientY - dotXY[1];

            return - Math.ceil(Math.atan2(offset.y, offset.x) * (360 / (2 * Math.PI)));
        },
        /**
         * @method _initControls
         * @chainable
         */
        _initControls: function() {
            var that = this,
                degree = that.get('degree'),
                value = 'rotate(' + (-degree) + 'deg)';

            that.vars.line.setStyles({
                'MozTransform': value,
                'webkitTransform': value,
                'OTransform': value,
                'transform': value
            });

            that.vars.input.set('value', degree);
            return that;
        },
        /**
         * @method setDegree
         * @param {Object}
         * @chainable
         */
        setDegree: function(param) {
            this.set('degree', param.value)._initControls()._fireCallback();
            return this;
        },
        /**
         * @method _fireCallback
         * @private
         * @chainable
         */
        _fireCallback: function() {
            this.get('onChange')(this.get('degree'));
            return this;
        }
    }, {
        ATTRS:{
            /**
             * @attribute wrap
             * @type String
             * @default 'body'
             * @description the wrap for controls to insert
             */
            wrap: {
                value: 'body',
                validator: Y.Lang.isString
            },
            /**
             * @attribute degree
             * @type Number
             * @default 0
             * @description degree for init
             */
            degree: {
                value: 0,
                validator: function(v){
                    if(/^-?1[0-7]\d$|^-?180$|^-?[1-9]\d$|^\d$|^-[1-9]$/.test(v)){
                        return true;
                    }else{
                        Y.log('"' + v + '" is not a valid degree!');
                        return false;
                    }
                }
            },
            /**
             * @attribute onInit
             * @type Function
             * @default function(){}
             * @description callback when widget init
             */
            onInit: {
                value: function() {
                },
                validator: Y.Lang.isFunction
            },
            /**
             * @attribute onChange
             * @type Function
             * @default function(){}
             * @description callback when degree change
             */
            onChange: {
                value: function() {
                },
                validator: Y.Lang.isFunction
            }
        }
    });
}, '1.0.0', {requires:['node', 'widget','codecola-degree-css']});