/*!
 * Flextable v 0.1.0
 * @author harper yang <hipoyang@gmail.com>
 */
(function (window) {
    
    // impose gobal object Flextable
    function Flextable(options) {
        this.tableId = options['tableId'];
    }
    // make title row float layout
    Flextable.prototype.floatTH = function () {
        var table = document.getElementById(this.tableId),
            trlist = table.tBodies[0].children;
        if (trlist.length >= 2) { // table rows amount more than 2
            var tr1 = trlist[0],
                tr2 = trlist[1];
            // setting first head row position: fixed
            tr1.style.position = 'fixed';
            tr1.style.top = '0';
            tr1.style.background = '#FFF';
            // setting header th width, acoording to columns width of first row 
            var columns1 = tr1.children;
                columns2 = tr2.children;
            for (var i = 0, len = columns2.length; i < len; i++) {
                // columns1[i].setAttribute('width', columns2[i].offsetWidth + 'px');
                // above all, we should get padding of counterpart column(required IE9+, mordern browser)
                // property value include 'px' unit
                var extraPadding = parseInt(window.getComputedStyle(columns2[i], null).getPropertyValue('padding-left')),
                    padding = (columns2[i].offsetWidth - columns1[i].offsetWidth) / 2 + extraPadding;
                columns1[i].style.paddingLeft = padding + 'px';
                columns1[i].style.paddingRight = padding + 'px';
                columns1[i].style.paddingTop = '10px';
                columns1[i].style.paddingBottom = '10px';
            }
            // avoid header row covering first row
            table.style.marginTop = tr1.offsetHeight + 'px';
        }
    };
    // show or hide columns
    Flextable.prototype.showColumn = function () {
    }
    window.Flextable = Flextable;
})(window);