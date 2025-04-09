---
title: "在一个项目中混合使用 Java 和 Kotlin – 教程"
---
Kotlin 提供了与 Java 的一流互操作性，并且现代 IDE 使其更加出色。
在本教程中，您将学习如何在 IntelliJ IDEA 的同一项目中使用 Kotlin 和 Java 源代码。要了解如何在 IntelliJ IDEA 中启动新的 Kotlin 项目，请参阅 [IntelliJ IDEA 入门](jvm-get-started)。

## 将 Java 源代码添加到现有的 Kotlin 项目

将 Java 类添加到 Kotlin 项目非常简单。您需要做的就是创建一个新的 Java 文件。选择项目中的目录或包，然后转到 **File** | **New** | **Java Class** 或使用 **Alt + Insert**/**Cmd + N** 快捷键。

<img src="/img/new-java-class.png" alt="Add new Java class" width="400" style={{verticalAlign: 'middle'}}/>

如果您已经拥有 Java 类，则只需将它们复制到项目目录即可。

现在，您可以从 Kotlin 使用 Java 类，反之亦然，而无需任何其他操作。

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

让您可以像在 Kotlin 中调用任何其他类型一样从 Kotlin 调用它。

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 将 Kotlin 源代码添加到现有的 Java 项目

将 Kotlin 文件添加到现有的 Java 项目几乎相同。

<img src="/img/new-kotlin-file.png" alt="Add new Kotlin file class" width="400" style={{verticalAlign: 'middle'}}/>

如果这是您第一次向该项目添加 Kotlin 文件，IntelliJ IDEA 将自动添加所需的 Kotlin 运行时（Kotlin runtime）。

<img src="/img/bundling-kotlin-option.png" alt="Bundling Kotlin runtime" width="350" style={{verticalAlign: 'middle'}}/>

您还可以从 **Tools** | **Kotlin** | **Configure Kotlin in Project** 手动打开 Kotlin 运行时配置。

## 使用 J2K 将现有的 Java 文件转换为 Kotlin

Kotlin 插件还捆绑了一个 Java 到 Kotlin 的转换器（Java to Kotlin converter，_J2K_），该转换器自动将 Java 文件转换为 Kotlin。
要在文件上使用 J2K，请在其上下文菜单或 IntelliJ IDEA 的 **Code** 菜单中单击 **Convert Java File to Kotlin File**。

<img src="/img/convert-java-to-kotlin.png" alt="Convert Java to Kotlin" width="500" style={{verticalAlign: 'middle'}}/>

虽然转换器并非万无一失，但它在将大多数样板代码从 Java 转换为 Kotlin 方面做得相当不错。
但是，有时需要进行一些手动调整。