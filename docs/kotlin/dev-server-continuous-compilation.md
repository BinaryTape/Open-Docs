[//]: # (title: 开发服务器与连续编译)

每次想要查看您所做的更改时，无需手动编译和运行您的 Kotlin/JS 项目，您可以使用*连续编译*模式。无需使用常规的 `jsBrowserDevelopmentRun` (用于 `browser`) 和 `jsNodeDevelopmentRun` (用于 `nodejs`) 命令，您可以在连续模式下调用 Gradle wrapper：

```bash
 # For `browser` project
./gradlew jsBrowserDevelopmentRun --continuous

 # For `nodejs` project
./gradlew jsNodeDevelopmentRun --continuous
```

如果您在 IntelliJ IDEA 中工作，可以通过运行配置列表传递相同的标志。首次从 IDE 运行 `jsBrowserDevelopmentRun` Gradle 任务后，IntelliJ IDEA 会自动为其生成一个运行配置，您可以在顶部工具栏对其进行编辑：

![在 IntelliJ IDEA 中编辑运行配置](edit-configurations.png){width=700}

通过**运行/调试配置**对话框启用连续模式非常简单，只需将 `--continuous` 标志添加到运行配置的实参中即可：

![在 IntelliJ IDEA 的运行配置中添加 continuous 标志](run-debug-configurations.png){width=700}

执行此运行配置时，您会注意到 Gradle 进程会持续监视程序的更改：

![Gradle 等待更改](waiting-for-changes.png){width=700}

一旦检测到更改，程序将自动重新编译。如果您在浏览器中仍然打开该页面，开发服务器将触发页面自动重新加载，并且更改将可见。这得益于由 [Kotlin Multiplatform Gradle plugin](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) 管理的集成 [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)。