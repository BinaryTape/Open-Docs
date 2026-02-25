[//]: # (title: 标准输入)

> Java Scanner 是一个速度较慢的工具。仅在需要其提供的特定功能时才使用它。
> 否则，通常首选使用 Kotlin 的 `readln()` 函数来[读取标准输入](basic-syntax.md#read-from-the-standard-input)。
>
{style="note"}

为了从标准输入读取数据，Java 提供了 `Scanner` 类。Kotlin 提供了两种从标准输入读取数据的主要方式：与 Java 类似的 `Scanner` 类，以及 `readln()` 函数。

## 使用 Java Scanner 读取标准输入

在 Java 中，标准输入通常通过 `System.in` 对象访问。你需要导入 `Scanner` 类，创建一个对象，并使用 `.nextLine()` 和 `.nextInt()` 等方法来读取不同的数据类型：

```java
// Java 实现
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 读取单行输入。例如：Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // 读取一个整数。例如：08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

### 在 Kotlin 中使用 Java Scanner

由于 Kotlin 与 Java 库的互操作性，你可以直接在 Kotlin 代码中开箱即用地访问 Java Scanner。

要在 Kotlin 中使用 Java Scanner，你需要导入 `Scanner` 类，并通过传入表示标准输入流并规定如何读取数据的 `System.in` 对象来进行初始化。
你可以使用[可用的读取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)来读取字符串以外的值，例如 `.nextLine()`、`.next()` 和 `.nextInt()`：

```kotlin
// 导入 Java Scanner
import java.util.Scanner

fun main() {
    // 初始化 Scanner
    val scanner = Scanner(System.`in`)

    // 读取整行字符串。例如："Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // 读取一个字符串。例如："Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // 读取一个数字。例如：123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

使用 Java Scanner 读取输入的其他有用方法包括 `.hasNext()`、`.useDelimiter()` 和 `.close()`： 

* `.hasNext()` 方法检查输入中是否还有更多可用数据。如果还有待迭代的元素，它将返回布尔值 `true`，如果输入中没有更多元素，则返回 `false`。

* `.useDelimiter()` 方法设置读取输入元素的分隔符。默认情况下的分隔符为空格，但你可以指定其他字符。例如，`.useDelimiter(",")` 会读取以逗号分隔的输入元素。 

* `.close()` 方法关闭与 Scanner 关联的输入流，防止进一步使用该 Scanner 读取输入。

> 在使用完 Java Scanner 后，务必使用 `.close()` 方法。关闭 Java Scanner 会释放其消耗的资源并确保程序行为正确。
>
{style="note"}

## 使用 readln() 读取标准输入

在 Kotlin 中，除了 Java Scanner 之外，你还可以使用 `readln()` 函数。它是读取输入最简单直接的方式。该函数从标准输入读取一行文本并将其作为字符串返回：

```kotlin
// 读取一个字符串。例如：Charlotte
val name = readln()

// 读取一个字符串并将其转换为整数。例如：43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

欲了解更多信息，请参阅[读取标准输入](read-standard-input.md)。