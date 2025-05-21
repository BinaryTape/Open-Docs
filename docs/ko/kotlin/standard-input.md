---
title: "표준 입력"
---
:::note
Java Scanner는 느린 도구입니다. 제공하는 특정 기능이 필요한 경우에만 사용하세요.
그렇지 않으면 일반적으로 Kotlin의 `readln()` 함수를 사용하여 [표준 입력에서 읽기](basic-syntax#read-from-the-standard-input)하는 것이 좋습니다.

:::

표준 입력에서 읽기 위해 Java는 `Scanner` 클래스를 제공합니다. Kotlin은 표준 입력에서 읽는 두 가지 주요 방법을 제공합니다.
Java와 유사한 `Scanner` 클래스와 `readln()` 함수입니다.

## Java Scanner를 사용하여 표준 입력에서 읽기

Java에서 표준 입력은 일반적으로 `System.in` 객체를 통해 액세스됩니다. `Scanner` 클래스를 import하고,
객체를 생성하고, `.nextLine()` 및 `.nextInt()`와 같은 메서드를 사용하여 다양한 데이터 형식을 읽어야 합니다.

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

### Kotlin에서 Java Scanner 사용

Kotlin은 Java 라이브러리와의 상호 운용성이 뛰어나므로
Kotlin 코드에서 Java Scanner에 바로 액세스할 수 있습니다.

Kotlin에서 Java Scanner를 사용하려면 `Scanner` 클래스를 import하고 표준 입력 스트림을 나타내고 데이터 읽기 방법을 지정하는 `System.in` 객체를 전달하여 초기화해야 합니다.
문자열과 다른 값을 읽기 위해 [사용 가능한 읽기 메서드](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)인
`.nextLine()`, `.next()`, `.nextInt()` 등을 사용할 수 있습니다.

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

Java Scanner를 사용하여 입력을 읽는 데 유용한 다른 메서드는 `.hasNext()`, `.useDelimiter()`, `.close()`입니다.

* `.hasNext()`
  메서드는 입력에 사용 가능한 데이터가 더 있는지 확인합니다. 반복할 나머지 요소가 있으면 부울 값 `true`를 반환하고 입력에 더 이상 요소가 없으면 `false`를 반환합니다.

* `.useDelimiter()` 메서드는 입력 요소 읽기를 위한 구분 기호를 설정합니다. 구분 기호는 기본적으로 공백이지만 다른 문자를 지정할 수 있습니다.
  예를 들어 `.useDelimiter(",")`는 쉼표로 구분된 입력 요소를 읽습니다.

* `.close()` 메서드는 Scanner와 연결된 입력 스트림을 닫아 더 이상 Scanner를 사용하여 입력을 읽을 수 없도록 합니다.

:::note
Java Scanner 사용이 끝나면 항상 `.close()` 메서드를 사용하세요. Java Scanner를 닫으면
사용하는 리소스를 해제하고 적절한 프로그램 동작을 보장합니다.

:::

## readln()으로 표준 입력에서 읽기

Kotlin에서는 Java Scanner 외에도 `readln()` 함수가 있습니다. 이것은 입력을 읽는 가장 간단한 방법입니다. 이 함수는 표준 입력에서 텍스트 줄을 읽고 문자열로 반환합니다.

```kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

자세한 내용은 [표준 입력 읽기](read-standard-input)를 참조하세요.