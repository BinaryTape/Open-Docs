[//]: # (title: 开发服务器和持续编译)

你无需每次都手动编译和执行 Kotlin/JS 项目以查看所做的更改，而是可以使用_持续编译_模式。无需使用常规的 `run` 命令，你可以以 _持续_ 模式调用 Gradle wrapper：

```bash
./gradlew run --continuous
```

如果你在 IntelliJ IDEA 中工作，可以通过 _运行配置_ 传递相同的标志。从 IDE 首次运行 Gradle `run` 任务后，IntelliJ IDEA 会自动为其生成一个运行配置，你可以对其进行编辑：

![在 IntelliJ IDEA 中编辑运行配置](edit-configurations.png){width=700}

通过 **运行/调试配置** 对话框启用持续模式，只需将 `--continuous` 标志添加到运行配置的参数中即可：

![在 IntelliJ IDEA 中为运行配置添加 continuous 标志](run-debug-configurations.png){width=700}

执行此运行配置时，你会注意到 Gradle 进程会持续监控程序的更改：

![Gradle 等待更改](waiting-for-changes.png){width=700}

一旦检测到更改，程序将自动重新编译。如果你仍然在浏览器中打开该页面，开发服务器将触发页面的自动重新加载，并且更改将变得可见。这得益于由 Kotlin Multiplatform Gradle 插件管理的集成 `webpack-dev-server`。