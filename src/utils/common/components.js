import Vue from 'vue'
import HeaderComponent from '@components/header/header-component';
import HeaderFilterComponent from '@components/header-filter/header-filter-component';
import HeaderCascaderComponent from '@components/header-input/header-cascader/header-cascader-component';
import HeaderDatepickerComponent from '@components/header-input/header-datepicker/header-datepicker-component';
import HeaderSelectComponent from '@components/header-input/header-select/header-select-component';
import HeaderTimepickerComponent from '@components/header-input/header-timepicker/header-timepicker-component';
import InputCascaderComponent from '@components/input-cascader/input-cascader-component';
import InputCheckboxComponent from '@components/input-checkbox/input-checkbox-component';
import InputDaterangeComponent from '@components/input-daterange/input-daterange-component';
import InputSearchComponent from '@components/input-search/input-search-component';
import InputTextComponent from '@components/input-text/input-text-component';
import InputTransferComponent from '@components/input-transfer/input-transfer-component';
import InputUploadComponent from '@components/input-upload/input-upload-component';
import RightDialogComponent from '@components/right-dialog/right-dialog-component';

// 定义 $v 全局变量
Vue.prototype.$v = {
    theme: 'default',
    paging: {
        layout: 'prev, pager, next, total, jumper, sizes',
        pageSizes: [5, 10, 20, 50],
        pageSize: 10,
        pagerCount: 5
    }
};
window.$v = Vue.prototype.$v;

export default {
    HeaderComponent,
    HeaderFilterComponent,
    HeaderCascaderComponent,
    HeaderDatepickerComponent,
    HeaderSelectComponent,
    HeaderTimepickerComponent,
    InputCascaderComponent,
    InputCheckboxComponent,
    InputDaterangeComponent,
    InputSearchComponent,
    InputTextComponent,
    InputTransferComponent,
    InputUploadComponent,
    RightDialogComponent
}