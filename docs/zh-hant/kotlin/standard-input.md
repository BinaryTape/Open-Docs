---
title: 標準輸入
---
:::note
Java Scanner 是一個較慢的工具。只有在需要它提供的特定功能時才使用它。
否則，通常最好使用 Kotlin 的 `readln()` 函數來 [讀取標準輸入](basic-syntax#read-from-the-standard-input)。

:::

要從標準輸入讀取資料，Java 提供了 `Scanner` 類別（class）。Kotlin 提供了兩種主要方式從標準輸入讀取資料：
與 Java 類似的 `Scanner` 類別（class）和 `readln()` 函數。

## 使用 Java Scanner 從標準輸入讀取資料

在 Java 中，標準輸入通常透過 `System.in` 物件（object）存取。你需要匯入 `Scanner` 類別（class）、
建立一個物件（object），並使用 `.nextLine()` 和 `.nextInt()` 等方法來讀取不同的資料類型：

```java
//Java 實作
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 讀取單行輸入。例如：Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // 讀取一個整數。例如：08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

### 在 Kotlin 中使用 Java Scanner

由於 Kotlin 與 Java 函式庫的互通性，
你可以直接從 Kotlin 程式碼存取 Java Scanner。

要在 Kotlin 中使用 Java Scanner，你需要匯入 `Scanner` 類別（class）並透過傳遞 `System.in` 物件（object）來初始化它，該物件（object）代表標準輸入流並指定如何讀取資料。
你可以使用 [可用的讀取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html) 讀取與字串不同的值，
例如 `.nextLine()`、`.next()` 和 `.nextInt()`：

```kotlin
// 匯入 Java Scanner
import java.util.Scanner

fun main() {
    // 初始化 Scanner
    val scanner = Scanner(System.`in`)

    // 讀取完整的字串行。例如："Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // 讀取一個字串。例如："Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // 讀取一個數字。例如：123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

使用 Java Scanner 讀取輸入的其他有用方法包括 `.hasNext()`、`.useDelimiter()` 和 `.close()`：

* `.hasNext()`
  方法檢查輸入中是否有更多可用資料。如果還有剩餘的元素可以迭代，則傳回布林值 `true`；如果輸入中沒有更多元素，則傳回 `false`。

* `.useDelimiter()` 方法設定讀取輸入元素的分隔符號（delimiter）。預設情況下，分隔符號（delimiter）是空格，但你可以指定其他字元。
  例如，`.useDelimiter(",")` 讀取以逗號分隔的輸入元素。

* `.close()` 方法關閉與 Scanner 相關聯的輸入流，防止進一步使用 Scanner 讀取輸入。

:::note
當你完成使用 Java Scanner 時，請務必使用 `.close()` 方法。關閉 Java Scanner
會釋放它消耗的資源，並確保程式行為正常。

:::

## 使用 readln() 從標準輸入讀取資料

在 Kotlin 中，除了 Java Scanner 之外，你還可以選擇 `readln()` 函數。這是讀取輸入最直接的方法。此函數從標準輸入讀取一行
文字，並將其作為字串傳回：

```kotlin
// 讀取一個字串。例如：Charlotte
val name = readln()

// 讀取一個字串並將其轉換為整數。例如：43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

如需更多資訊，請參閱 [讀取標準輸入](read-standard-input)。