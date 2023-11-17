export const columns = (context) => [
    {
        title: context.$t('no'),
        key: 'no',
        scopedSlots: {
            customRender: 'no'
        }
    },
    {
        title: context.$t('employeeName'),
        dataIndex: 'empname',
        key: 'empname'
    },
    {
        title: context.$t('employeeNumber'),
        dataIndex: 'empno',
        key: 'empno'
    },
    {
        title: context.$t('orderNumber'),
        dataIndex: 'orderno',
        key: 'orderNumber'
    },
    {
        title: context.$t('contractStartDate'),
        dataIndex: 'contract-from',
        key: 'contractStartDate'
    },
    {
        title: context.$t('contractEndDate'),
        dataIndex: 'contract-to',
        key: 'contractEndDate'
    },
    {
        title: '',
        key: 'selectButton',
        scopedSlots: {
            customRender: 'selectButton'
        },
        width: 10
    }
];
