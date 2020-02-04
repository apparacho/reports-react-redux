const { override, fixBabelImports, addLessLoader, useEslintRc } = require('customize-cra');
const path = require('path');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

useEslintRc();

const themeLessFileName = path.resolve(path.join(__dirname, 'src', 'theme.less')),
    rtThemeLessFileName = path.resolve(path.join(__dirname, 'src', 'rt-theme.less')),
    deploymentEnv = process.env.REACT_APP_ENV;

const overrideFn = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),

    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            'hack': `true; @import "${themeLessFileName}";` + ((deploymentEnv === 'dev_rt' || deploymentEnv === 'rt') ? ` @import "${rtThemeLessFileName}";` : '')
        }
    }),
);


module.exports = function override(config, env) {
    const nConfig = overrideFn(config, env);
    nConfig.plugins.push(new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
    }))
    return nConfig
}
