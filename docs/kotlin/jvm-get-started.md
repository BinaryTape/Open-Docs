，方法是直接在文本输出中的变量名前添加美元符号，如下所示 – `$name`。
   
```kotlin
fun main() {
    println("What's your name?")
    val name = readln()
    println("Hello, $name!")

    // ...
}
```

## 运行应用

现在应用已准备好运行。最简单的方法是点击装订区域中的绿色 **Run** 图标，然后选择 **Run 'MainKt'**。

![运行控制台应用](jvm-run-app.png){width=350}

你可以在 **Run** 工具窗口中查看结果。

![Kotlin 运行输出](jvm-output-1.png){width=600}
   
输入你的名字并接受来自应用的问候！ 

![Kotlin 运行输出](jvm-output-2.png){width=600}

恭喜！你刚刚运行了你的第一个 Kotlin 应用。

## 下一步

创建此应用后，你可以开始深入了解 Kotlin 语法：

* 参加 [Kotlin 之旅](kotlin-tour-welcome.md) 
* 为 IDEA 安装 [JetBrains Academy 插件](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy) 并完成 [Kotlin Koans 课程](https://plugins.jetbrains.com/plugin/10081-jetbrains-academy/docs/learner-start-guide.html?section=Kotlin%20Koans) 中的练习