[//]: # (title: 在一个项目中混合使用 Java 和 Kotlin – 教程)

Kotlin 提供了与 Java 的一流互操作性，现代 IDE 使其表现更佳。
在本教程中，您将学习如何在 IntelliJ IDEA 的同一个项目中同时使用 Kotlin 和 Java 源代码。要了解如何在 IntelliJ IDEA 中启动新的 Kotlin 项目，请参阅 [IntelliJ IDEA 入门](jvm-get-started.md)。

## 将 Java 源代码添加到现有 Kotlin 项目

将 Java 类添加到 Kotlin 项目非常简单。您只需创建一个新的 Java 文件。选择项目中的目录或包，然后导航到 **File** | **New** | **Java Class**，或者使用 **Alt + Insert**/**Cmd + N** 快捷键。

![添加新的 Java 类](new-java-class.png){width=400}

如果您已经有 Java 类，可以直接将它们复制到项目目录中。

现在，您无需任何额外操作即可从 Kotlin 中使用 Java 类，反之亦然。

例如，添加以下 Java 类：

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```

允许您像在 Kotlin 中调用任何其他类型一样从 Kotlin 调用它。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 将 Kotlin 源代码添加到现有 Java 项目

将 Kotlin 文件添加到现有 Java 项目大致相同。

![添加新的 Kotlin 文件类](new-kotlin-file.png){width=400}

如果这是您第一次将 Kotlin 文件添加到此项目，IntelliJ IDEA 将自动添加所需的 Kotlin 运行时。

![捆绑 Kotlin 运行时](bundling-kotlin-option.png){width=350}

您也可以从 **Tools** | **Kotlin** | **Configure Kotlin in Project** 手动打开 Kotlin 运行时配置。

## 使用 J2K 将现有 Java 文件转换为 Kotlin

Kotlin 插件还捆绑了一个 Java 到 Kotlin 的转换器 (J2K)，它可以自动将 Java 文件转换为 Kotlin。
要在一个文件上使用 J2K，请在其上下文菜单或 IntelliJ IDEA 的 **Code** 菜单中点击 **Convert Java File to Kotlin File**。

![将 Java 转换为 Kotlin](convert-java-to-kotlin.png){width=500}

虽然此转换器并非万无一失，但它在将大部分 Java 样板代码转换为 Kotlin 方面做得相当不错。然而，有时需要一些手动调整。