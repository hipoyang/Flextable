##Flextable
Flextable is a flexible table library.
##Introduction
* the first row fixed
* hide or show special columns
* sort according to column header

##Usage
You can use `bower install` command install the library.
```shell
bower install Flextable
``` 
## Demo
include `Flextable.css` and `Flextable.js` in your html.
```javascript
<script>
    new Flextable({
        'tableId': 'flextable',
        'hideCol': true
    });
</script>
```
Besides, you can check `examples` directory.