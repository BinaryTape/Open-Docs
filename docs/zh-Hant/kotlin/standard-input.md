[//]: # (title: 標準輸入)

> Java Scanner 是一個緩慢的工具。僅在需要其提供的特定功能時才使用它。
> 否則，通常建議使用 Kotlin 的 `readln()` 函式來[讀取標準輸入](basic-syntax.md#read-from-the-standard-input)。
>
{style="note"}

若要從標準輸入讀取，Java 提供了 `Scanner` 類別。Kotlin 提供兩種讀取標準輸入的主要方式：與 Java 類似的 `Scanner` 類別，以及 `readln()` 函式。

## 使用 Java Scanner 讀取標準輸入

在 Java 中，通常透過 `System.in` 物件存取標準輸入。你需要匯入 `Scanner` 類別、建立一個物件，並使用 `.nextLine()` 與 `.nextInt()` 等方法來讀取不同的資料型別：

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

由於 Kotlin 與 Java 程式庫的互通性，你可以直接在 Kotlin 程式碼中開箱即用地存取 Java Scanner。

要在 Kotlin 中使用 Java Scanner，你需要匯入 `Scanner` 類別，並透過傳遞代表標準輸入流且決定如何讀取資料的 `System.`in`` 物件來將其初始化。
你可以使用[可用的讀取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)來讀取字串以外的值，例如 `.nextLine()`、`.next()` 和 `.nextInt()`：

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

使用 Java Scanner 讀取輸入的其他實用方法包括 `.hasNext()`、`.useDelimiter()` 和 `.close()`： 

* `.hasNext()` 方法會檢查輸入中是否還有更多可用的資料。如果有剩餘元素可供反覆運算，它會傳回布林值 `true`；若輸入中已無剩餘元素，則傳回 `false`。

* `.useDelimiter()` 方法用於設定讀取輸入元素的分隔符號。預設為空白字元，但你可以指定其他字元。例如，`.useDelimiter(",")` 會讀取以逗號分隔的輸入元素。 

* `.close()` 方法會關閉與 Scanner 關聯的輸入流，防止進一步使用該 Scanner 讀取輸入。

> 使用完 Java Scanner 後，請務必使用 `.close()` 方法。關閉 Java Scanner 會釋放其消耗的資源，並確保程式行為正確。
>
{style="note"}

## 使用 readln() 讀取標準輸入

在 Kotlin 中，除了 Java Scanner 之外，你還可以使用 `readln()` 函式。這是讀取輸入最直接的方法。此函式從標準輸入讀取一行文字並將其作為字串傳回：

```kotlin
// 讀取一個字串。例如：Charlotte
val name = readln()

// 讀取一個字串並將其轉換為整數。例如：43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

若要了解更多資訊，請參閱[讀取標準輸入](read-standard-input.md)。