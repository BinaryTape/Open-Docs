---
title: 开发服务器和持续编译
---
每次想要查看你所做的更改时，不必手动编译和执行 Kotlin/JS 项目，你可以使用 _连续编译_ 模式（_continuous compilation_ mode）。使用在 _连续_ 模式（_continuous_ mode）下调用 Gradle 包装器（Gradle wrapper）来替代使用常规的 `run` 命令：

```bash
./gradlew run --continuous
```

如果你正在 IntelliJ IDEA 中工作，你可以通过 _运行配置_（_run configuration_）传递相同的标志。在首次从 IDE 运行 Gradle
`run` 任务后，IntelliJ IDEA 会自动为其生成一个运行配置，你可以对其进行编辑：

<img src="/img/edit-configurations.png" alt="Editing run configurations in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

通过 **Run/Debug Configurations** 对话框启用连续模式非常简单，只需将 `--continuous` 标志添加到运行配置的参数中即可：

<img src="/img/run-debug-configurations.png" alt="Adding the continuous flag to a run configuration in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

当执行此运行配置时，你可以注意到 Gradle 进程持续监视程序的更改：

<img src="/img/waiting-for-changes.png" alt="Gradle waiting for changes" width="700" style={{verticalAlign: 'middle'}}/>

一旦检测到更改，程序将自动重新编译。如果你仍然在浏览器中打开该页面，则开发服务器将触发页面的自动重新加载，并且更改将变为可见。这得益于 Kotlin Multiplatform Gradle 插件管理的集成 `webpack-dev-server`。