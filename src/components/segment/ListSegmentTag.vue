<template>
    <div>
        <a-tag class="bg-danger">
            {{ $t('date') }}
        </a-tag>
        <a-tag class="bg-info">
            {{ $t('weekday') }}
        </a-tag>
        <a-tag class="bg-warning">
            {{ $t('startTime') }}
        </a-tag>
        <a-tag class="bg-success">
            {{ $t('finishTime') }}
        </a-tag>
        <a-tag class="bg-primary">
            {{ $t('breakTime') }}
        </a-tag>
    </div>
</template>

<script>
export default {
    name: 'ListSegmentTag'
};
</script>
