[//]: # (title: 표준 입력)

> Java `Scanner`는 느린 도구입니다. 제공하는 특정 기능이 필요할 때만 사용하세요.
> 그렇지 않다면, Kotlin의 `readln()` 함수를 사용하여 [표준 입력 읽기](basic-syntax.md#read-from-the-standard-input)를 하는 것이 일반적으로 더 좋습니다.
>
{style="note"}

표준 입력을 읽기 위해 Java는 `Scanner` 클래스를 제공합니다. Kotlin은 표준 입력을 읽는 두 가지 주요 방법을 제공합니다. Java와 유사한 `Scanner` 클래스와 `readln()` 함수입니다.

## Java Scanner로 표준 입력 읽기

Java에서는 일반적으로 `System.in` 객체를 통해 표준 입력에 접근합니다. `Scanner` 클래스를 임포트하고, 객체를 생성한 다음, `.nextLine()`, `.nextInt()`와 같은 메서드를 사용하여 다양한 데이터 타입을 읽어야 합니다.

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

### Kotlin에서 Java Scanner 사용하기

Kotlin의 Java 라이브러리와의 상호 운용성 덕분에, 별도의 설정 없이 Kotlin 코드에서 Java `Scanner`에 접근할 수 있습니다.

Kotlin에서 Java `Scanner`를 사용하려면 `Scanner` 클래스를 임포트하고, 표준 입력 스트림을 나타내며 데이터를 읽는 방법을 지시하는 `System.in` 객체를 전달하여 초기화해야 합니다. 문자열 외의 값을 읽기 위해 `.nextLine()`, `.next()`, `.nextInt()`와 같은 [사용 가능한 읽기 메서드](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)를 사용할 수 있습니다.

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

Java `Scanner`로 입력을 읽는 데 유용한 다른 메서드로는 `.hasNext()`, `.useDelimiter()`, `.close()`가 있습니다.

*   `.hasNext()` 메서드는 입력에 더 많은 데이터가 사용 가능한지 확인합니다. 반복할 남은 요소가 있으면 부울 값 `true`를 반환하고, 입력에 더 이상 요소가 남아 있지 않으면 `false`를 반환합니다.

*   `.useDelimiter()` 메서드는 입력 요소를 읽기 위한 구분자를 설정합니다. 구분자는 기본적으로 공백이지만, 다른 문자를 지정할 수 있습니다. 예를 들어, `.useDelimiter(",")`는 쉼표로 구분된 입력 요소를 읽습니다.

*   `.close()` 메서드는 `Scanner`와 연결된 입력 스트림을 닫아 `Scanner`를 통한 추가적인 입력 읽기를 방지합니다.

> Java `Scanner` 사용을 마쳤을 때는 항상 `.close()` 메서드를 사용하세요. Java `Scanner`를 닫으면 `Scanner`가 사용하는 리소스가 해제되고 프로그램의 올바른 동작을 보장합니다.
>
{style="note"}

## readln()으로 표준 입력 읽기

Kotlin에서는 Java `Scanner` 외에도 `readln()` 함수를 사용할 수 있습니다. 이것은 입력을 읽는 가장 간단한 방법입니다. 이 함수는 표준 입력에서 한 줄의 텍스트를 읽고 문자열로 반환합니다.

```kotlin
// Reads a string. For example: Charlotte
val name = readln()

// Reads a string and converts it into an integer. For example: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

더 자세한 내용은 [표준 입력 읽기](read-standard-input.md)를 참조하세요.