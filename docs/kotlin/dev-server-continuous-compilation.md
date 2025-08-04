[//]: # (title: 开发服务器与连续编译)

无需每次手动编译和执行 Kotlin/JS 项目以查看您所做的更改，您可以使用*连续编译*模式。无需使用常规的 `run` 命令，您可以在*连续*模式下调用 Gradle wrapper：

```bash
./gradlew run --continuous
```

如果您在 IntelliJ IDEA 中工作，可以通过*运行配置*传递相同的标志。首次从 IDE 运行 Gradle `run` 任务后，IntelliJ IDEA 会自动为其生成一个运行配置，您可以对其进行编辑：

![Editing run configurations in IntelliJ IDEA](edit-configurations.png){width=700}

通过**运行/调试配置**对话框启用连续模式非常简单，只需将 `--continuous` 标志添加到运行配置的实参中即可：

![Adding the continuous flag to a run configuration in IntelliJ IDEA](run-debug-configurations.png){width=700}

执行此运行配置时，您会注意到 Gradle 进程会持续监视程序的更改：

![Gradle waiting for changes](waiting-for-changes.png){width=700}

一旦检测到更改，程序将自动重新编译。如果您在浏览器中仍然打开该页面，开发服务器将触发页面自动重新加载，并且更改将可见。这得益于由 Kotlin Multiplatform Gradle plugin 管理的集成 `webpack-dev-server`。