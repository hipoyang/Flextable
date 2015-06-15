/*!
 * Flextable v 0.1.0
 * @author harper yang <hipoyang@gmail.com>
 */
(function (window) {
    // impose gobal object Flextable
    function Flextable(options) {
        this.hideCol = options['hideCol'] ? true : false;
        this.fixedHeader = options['fixedHeader'] ? true : false;
        this.table = document.getElementById(options['tableId']);
        this.checkboxList = [];
        this.fixedHeader && this.floatTH();
        this.init();
        this.sortCells();
        window.Flextable = this;
    }
    Flextable.prototype.init = function () {
        this.table.className = 'flextable';
        // init shoColumn module
        if (this.hideCol) {
            var trlist = this.table.rows,
                tdNames = [],
                toolbar = document.createElement('div'),
                tip = document.createElement('header'),
                // check all
                checkAllBox = document.createElement('div'),
                checkAll = document.createElement('input');
            tip.innerHTML = '隐藏表格列：';
            toolbar.className = 'col-toolbar';
            toolbar.appendChild(tip);
            checkAll.type = 'checkbox';
            checkAll.id = 'checkAll';
            checkAllBox.appendChild(checkAll);
            checkAllBox.appendChild(document.createTextNode('全选'));
            checkAllBox.className = 'check-all';
            tip.appendChild(checkAllBox);
            this.table.parentNode.appendChild(toolbar);

            // check all event handler
            checkAll.addEventListener('change', function(event) {
                var flag = event.target.checked;
                var checkboxList = window.Flextable.checkboxList;
                for (var i = 0, len = checkboxList.length; i < len; i++) {
                    checkboxList[i].checked = flag;
                    window.Flextable.showColumn(checkboxList[i].getAttribute('data-col'), flag);
                }
            });

            if (trlist.length > 0) {
                // get column name
                for (var i = 0, len = trlist[0].cells.length; i < len; i++) {
                    tdNames.push(trlist[0].cells[i].innerHTML);
                }
            }
            // create fields element
            for (var i = 0, len = tdNames.length; i < len; i++) {
                var checkbox = document.createElement('input'),
                    label = document.createElement('label'),
                    text = document.createTextNode(tdNames[i]);
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-col', i);
                checkbox.addEventListener('change', function(event) {
                    var col = event.target.getAttribute('data-col');
                    window.Flextable.showColumn(col, event.target.checked);
                })
                label.appendChild(text);
                label.insertBefore(checkbox, text);
                toolbar.appendChild(label);
                this.checkboxList.push(checkbox);
            }
        }
        // init table viewport according to parentNode width
        var parentWidth = this.table.parentNode.offsetWidth,
            rows = this.table.rows;
        if (rows.length > 1) {
            for (var i = 0, len = rows[1].cells.length; i < len; i++) {
                if (rows[1].cells[i].offsetWidth + rows[1].cells[i].offsetLeft > parentWidth) {
                    for (var j = 0, l = rows.length; j < l; j++) {
                        rows[j].cells[i].style.display = 'none';
                    }
                    // make current column checkbox checked
                    for (var j = 0, l = this.checkboxList.length; j < l; j++) {
                        if (this.checkboxList[j].getAttribute('data-col') == i) {
                            this.checkboxList[j].checked = 'checked';
                        }
                    }
                }
            }
        }
        // fix toolbar covering the part of table
        this.table.parentNode.style.paddingBottom = toolbar.offsetHeight + 10 + 'px';
    };
    // make title row float layout
    Flextable.prototype.floatTH = function () {
        var trlist = this.table.rows;
        if (trlist.length >= 2) { // table rows amount more than 2
            var tr1 = trlist[0],
                tr2 = trlist[1];
            // setting first head row position: fixed
            tr1.className = 'fixed-header';
            // setting header th width, acoording to columns width of first row 
            var columns1 = tr1.cells,
                columns2 = tr2.cells;
            for (var i = 0, len = columns2.length; i < len; i++) {
                var width1 = columns1[i].offsetWidth,
                    width2 = columns2[i].offsetWidth;
                // contents' width more than titles'
                if (width2 > width1) {
                    // columns1[i].setAttribute('width', columns2[i].offsetWidth + 'px');
                    // above all, we should get padding of counterpart column(required IE9+, mordern browser)
                    // property value include 'px' unit
                    var extraPadding = parseInt(window.getComputedStyle(columns2[i], null).getPropertyValue('padding-left')),
                        padding = (columns2[i].offsetWidth - columns1[i].offsetWidth) / 2 + extraPadding;
                    columns1[i].style.paddingLeft = padding + 'px';
                    columns1[i].style.paddingRight = padding + 'px';
                    columns1[i].style.paddingTop = '10px';
                    columns1[i].style.paddingBottom = '10px';
                } else {  // vice versa
                    var extraPadding = parseInt(window.getComputedStyle(columns1[i], null).getPropertyValue('padding-left')),
                        padding = (columns1[i].offsetWidth - columns2[i].offsetWidth) / 2 + extraPadding;
                    for (var j = 1, l = trlist.length; j < l; j++) {
                        trlist[j].cells[i].style.paddingLeft = padding + 'px';
                        trlist[j].cells[i].style.paddingRight = padding + 'px';
                    }
                }
            }
            // avoid header row covering first row
            this.table.style.marginTop = tr1.offsetHeight + 'px';
        }
    };
    // show or hide columns
    Flextable.prototype.showColumn = function (col, flag) {
        if (this.hideCol) {
            var trlist = this.table.rows;
            for (var i = 0, len = trlist.length; i < len; i++) {
                flag ? trlist[i].cells[col].style.display = 'none'
                        : trlist[i].cells[col].style.display = 'table-cell';
            }
        }
    };
    // column sort
    Flextable.prototype.sortCells = function () {
        if (this.table.rows.length > 0) {
            var firstRow = this.table.rows[0];
            for(var i = 0, len = firstRow.cells.length; i < len; i++) {
                firstRow.cells[i].style.cursor = 'pointer';
                firstRow.cells[i].setAttribute('data-col', i);
                firstRow.cells[i].onclick = function (event) {
                    var sendor = event.target,
                        colNum = sendor.getAttribute('data-col'),
                        colContent = sendor.innerHTML,
                        curTable = window.Flextable.table,
                        trList = new Array,
                        count = 0;  // even stand for asc, odd stand for desc
                    if (!sendor.getAttribute('data-count')) { 
                        sendor.setAttribute('data-count', 0); 
                    } else { 
                        count = parseInt(sendor.getAttribute('data-count')); 
                        count++; 
                        sendor.setAttribute('data-count', count); 
                    } 
                    for (var j = 1, l = curTable.rows.length; j < l; j++) {
                        trList[j - 1] = curTable.rows[j];
                    } 
                    if (count % 2 === 0) {
                        for (var j = 0, l = trList.length; j < l; j++) {
                            for (var k = j + 1, d = trList.length; k < d; k++) {
                                if (trList[j].cells[colNum].innerHTML.localeCompare(trList[k].cells[colNum].innerHTML)) {
                                    var tmpTr = trList[j];
                                    trList[j] = trList[k];
                                    trList[k] = tmpTr;
                                }
                            }
                        }
                    } else {
                        for (var j = 0, l = trList.length; j < l; j++) {
                            for (var k = j + 1, d = trList.length; k < d; k++) {
                                if (trList[k].cells[colNum].innerHTML.localeCompare(trList[j].cells[colNum].innerHTML)) {
                                    var tmpTr = trList[j];
                                    trList[j] = trList[k];
                                    trList[k] = tmpTr;
                                }
                            }
                        }
                    }
                    var idx = 1;
                    while(curTable.rows.length !== 1) {
                        curTable.tBodies[0].removeChild(curTable.rows[idx]);
                    }
                    for (var j = 0, l = trList.length; j < l; j++) {
                        console.log(trList[j]);
                        curTable.tBodies[0].appendChild(trList[j]);
                    } 
                }
            }
        }
    };
    window.Flextable = Flextable;
})(window);