/**
 * @name:codecola degree widget
 * @author:zhouqicf@gmail.com
 * @site:www.zhouqicf.com
 * @version:2-0-0
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
                'input' : Y.Node.create('<input type="text" class="codecola-degree-input" max="180" min="-180">')
            };
            var _val = that.vars,
                _degreeWrap = _val.degreeWrap,
                _degree = _val.degree,
                _line = _val.line,
                _dot = _val.dot,
                _label = _val.label,
                _input = _val.input;

            _degree.append(_line);
            _degree.append(_dot);
            _label.append(_input);
            _label.append(Y.Node.create('度'));
            _degreeWrap.append(_degree);
            _degreeWrap.append(_label);
            Y.one(that.get('wrap')).append(_degreeWrap);
        },

        bindUI: function() {
            var that = this,
                drag = false,
                vars = that.vars,
                doc = Y.one('document');
            vars.degree.on('click', function(e) {
                that.setDegree(that._countDegree(e));
            });
            vars.degree.on('mousedown', function(e) {
                drag = true;
                doc.setStyle('webkitUserSelect', 'none');
                that._countDegree(e);
            });
            doc.on('mouseup', function() {
                drag = false;
                doc.setStyle('webkitUserSelect', '');
            });
            doc.on('mousemove', function(e) {
                if (!drag) {
                    return;
                }
                that.setDegree(that._countDegree(e));
            });
            vars.input.on('change', function() {
                that.setDegree(this.get('value'));
            });
        },

        syncUI: function() {
            this.setDegree(this.get('degree'));
        },

        /**
         * @method _countDegree
         * @private
         * @param {Event}
         * @return {Number}
         */
        _countDegree: function(e) {
            var _dot = this.vars.dot,
                _degree,
                _dotXY = _dot.getXY(),
                _offset = {};

            _offset.x = e.clientX - _dotXY[0];
            _offset.y = e.clientY - _dotXY[1];

            return - Math.ceil(Math.atan2(_offset.y, _offset.x) * (360 / (2 * Math.PI)));
        },
        /**
         * @method showDegree
         */
        showDegree: function() {
            var that = this,
                _degree = that.get('degree'),
                _value = 'rotate(' + (-_degree) + 'deg)';

            that.vars.line.setStyles({
                'MozTransform': _value,
                'webkitTransform': _value,
                'OTransform': _value,
                'transform': _value
            });

            that.vars.input.set('value', _degree);

            return that;
        },
        /**
         * @method setDegree
         * @param {Number}
         */
        setDegree: function(_degree) {
            var that = this;
            that.set('degree', _degree).showDegree()._onSetDegree();

            return that;
        },
        /**
         * @method _onSetDegree
         * @private
         */
        _onSetDegree: function() {
            this.get('afterChange')(this.get('degree'));

            return this;
        }
    }, {
        ATTRS:{
            wrap: {
                value: '',
                validator: Y.Lang.isString
            },
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
            afterChange: {
                value: function() {
                },
                validator: Y.Lang.isFunction
            }
        }
    });
}, '1.0.0', {requires:['node', 'widget','codecola-degree-css']});