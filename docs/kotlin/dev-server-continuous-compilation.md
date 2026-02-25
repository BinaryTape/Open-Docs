[//]: # (title: 开发服务器与持续编译)

与其在每次想要查看所做的更改时都手动编译并运行 Kotlin/JS 项目，不如使用*持续编译*模式。无需使用常规的 `jsBrowserDevelopmentRun`（针对 `browser`）和 `jsNodeDevelopmentRun`（针对 `nodejs`）命令，而是以持续模式调用 Gradle wrapper：

```bash
 # 针对 `browser` 项目
./gradlew jsBrowserDevelopmentRun --continuous

 # 针对 `nodejs` 项目
./gradlew jsNodeDevelopmentRun --continuous
```

如果您正在使用 IntelliJ IDEA，可以通过运行配置列表传递相同的标记。在首次从 IDE 运行 `jsBrowserDevelopmentRun` Gradle 任务后，IntelliJ IDEA 会自动为其生成一个运行配置，您可以在顶部工具栏中对其进行编辑：

![在 IntelliJ IDEA 中编辑运行配置](edit-configurations.png){width=700}

通过 **运行/调试配置** 对话框启用持续模式，方法是在该运行配置的实参中添加 `--continuous` 标记：

![在 IntelliJ IDEA 的运行配置中添加 continuous 标记](run-debug-configurations.png){width=700}

执行此运行配置时，您可以注意到 Gradle 进程会持续监视程序的更改：

![Gradle 正在等待更改](waiting-for-changes.png){width=700}

一旦检测到更改，程序将自动重新编译。如果您仍浏览器中打开着网页，开发服务器将触发页面的自动重新加载，从而使更改可见。这要归功于由 [Kotlin 多平台 Gradle 插件](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) 管理的集成型 [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)。