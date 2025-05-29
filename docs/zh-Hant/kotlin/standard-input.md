[//]: # (title: 標準輸入)

> Java Scanner 是一個緩慢的工具。僅在您需要它提供的特定功能時才使用它。
> 否則，通常更推薦使用 Kotlin 的 `readln()` 函數來[讀取標準輸入](basic-syntax.md#read-from-the-standard-input)。
>
{style="note"}

為了從標準輸入讀取資料，Java 提供了 `Scanner` 類別。Kotlin 提供了兩種主要方式來從標準輸入讀取資料：
與 Java 類似的 `Scanner` 類別，以及 `readln()` 函數。

## 使用 Java Scanner 從標準輸入讀取

在 Java 中，標準輸入通常透過 `System.in` 物件來存取。您需要匯入 `Scanner` 類別，
建立一個物件，並使用像是 `.nextLine()` 和 `.nextInt()` 等方法來讀取不同的資料型別：

```java
//Java implementation
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Reads a single line of input. For example: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // Reads an integer. For example: 08081990
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
您可以直接從 Kotlin 程式碼中存取 Java Scanner。

要在 Kotlin 中使用 Java Scanner，您需要匯入 `Scanner` 類別，並透過傳入一個代表標準輸入流並指示如何讀取資料的 `System.in` 物件來初始化它。
您可以使用[可用的讀取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)來讀取非字串的值，
例如 `.nextLine()`、`.next()` 和 `.nextInt()`：

```kotlin
// Imports Java Scanner
import java.util.Scanner

fun main() {
    // Initializes the Scanner
    val scanner = Scanner(System.`in`)

    // Reads a whole string line. For example: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // Reads a string. For example: "Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // Reads a number. For example: 123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

使用 Java Scanner 讀取輸入的其他有用方法包括 `.hasNext()`、`.useDelimiter()` 和 `.close()`：

* `.hasNext()` 方法會檢查輸入中是否有更多可用資料。如果有剩餘元素可供迭代，它會返回布林值 `true`；如果輸入中沒有剩餘元素，則返回 `false`。

* `.useDelimiter()` 方法會設定用於讀取輸入元素的分隔符。預設情況下，分隔符是空白字元，但您可以指定其他字元。
  例如，`.useDelimiter(",")` 會讀取以逗號分隔的輸入元素。

* `.close()` 方法會關閉與 Scanner 相關聯的輸入流，防止 Scanner 進一步用於讀取輸入。

> 當您使用 Java Scanner 完畢後，務必使用 `.close()` 方法。關閉 Java Scanner
> 會釋放其所消耗的資源，並確保程式行為正常。
>
{style="note"}

## 使用 readln() 從標準輸入讀取

在 Kotlin 中，除了 Java Scanner 之外，您還可以使用 `readln()` 函數。這是讀取輸入最直接的方式。此函數會從標準輸入中讀取一行文字，
並將其作為字串返回：

```kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

更多資訊請參閱[讀取標準輸入](read-standard-input.md)。