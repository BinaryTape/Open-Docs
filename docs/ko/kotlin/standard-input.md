[//]: # (title: 표준 입력)

> Java Scanner는 속도가 느린 도구입니다. 이 도구가 제공하는 특정 기능이 필요한 경우에만 사용하세요.
> 그렇지 않다면, 일반적으로 [표준 입력을 읽기](basic-syntax.md#read-from-the-standard-input) 위해 Kotlin의 `readln()` 함수를 사용하는 것이 좋습니다.
>
{style="note"}

표준 입력(standard input)으로부터 데이터를 읽기 위해 Java는 `Scanner` 클래스를 제공합니다. Kotlin은 표준 입력으로부터 읽는 두 가지 주요 방법을 제공합니다: Java와 유사한 `Scanner` 클래스와 `readln()` 함수입니다.

## Java Scanner를 사용하여 표준 입력 읽기

Java에서 표준 입력은 일반적으로 `System.in` 객체를 통해 접근합니다. `Scanner` 클래스를 임포트하고, 객체를 생성한 후, `.nextLine()` 및 `.nextInt()`와 같은 메서드를 사용하여 다양한 데이터 타입을 읽어야 합니다.

```java
//Java 구현
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 한 줄의 입력을 읽습니다. 예: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // You entered: Hi there!

        // 정수를 읽습니다. 예: 08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // You entered: 08081990

        scanner.close();
    }
}
```

### Kotlin에서 Java Scanner 사용하기

Kotlin은 Java 라이브러리와의 상호운용성(interoperability) 덕분에, 별도의 설정 없이 Kotlin 코드에서 Java Scanner를 바로 사용할 수 있습니다.

Kotlin에서 Java Scanner를 사용하려면 `Scanner` 클래스를 임포트하고, 표준 입력 스트림을 나타내며 데이터를 읽는 방법을 결정하는 `System.`in`` 객체를 전달하여 초기화해야 합니다.
문자열 이외의 값을 읽기 위해 `.nextLine()`, `.next()`, `.nextInt()`와 같은 [사용 가능한 읽기 메서드](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html)를 사용할 수 있습니다.

```kotlin
// Java Scanner를 임포트합니다.
import java.util.Scanner

fun main() {
    // Scanner를 초기화합니다.
    val scanner = Scanner(System.`in`)

    // 문자열 한 줄 전체를 읽습니다. 예: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // Hello, Kotlin

    // 문자열 하나를 읽습니다. 예: "Hello"
    val string = scanner.next()
    print(string)
    // Hello

    // 숫자를 읽습니다. 예: 123
    val num = scanner.nextInt()
    print(num)
    // 123
}
```

Java Scanner로 입력을 읽을 때 유용한 다른 메서드로는 `.hasNext()`, `.useDelimiter()`, `.close()`가 있습니다.

* `.hasNext()` 메서드는 입력에 더 많은 데이터가 있는지 확인합니다. 반복할 요소가 남아 있으면 불리언 값 `true`를 반환하고, 더 이상 요소가 없으면 `false`를 반환합니다.

* `.useDelimiter()` 메서드는 입력 요소를 읽기 위한 구분자(delimiter)를 설정합니다. 기본 구분자는 공백(whitespace)이지만, 다른 문자를 지정할 수 있습니다. 
  예를 들어, `.useDelimiter(",")`는 쉼표로 구분된 입력 요소를 읽습니다. 

* `.close()` 메서드는 Scanner와 연결된 입력 스트림을 닫아, 이후 해당 Scanner를 사용해 입력을 읽는 것을 방지합니다.

> Java Scanner 사용을 마쳤을 때는 항상 `.close()` 메서드를 사용하세요. Java Scanner를 닫으면 사용 중인 리소스를 해제하고 프로그램이 올바르게 동작하도록 보장합니다.
>
{style="note"}

## readln()을 사용하여 표준 입력 읽기

Kotlin에는 Java Scanner 외에도 `readln()` 함수가 있습니다. 이는 입력을 읽는 가장 간단한 방법입니다. 이 함수는 표준 입력에서 텍스트 한 줄을 읽어 문자열로 반환합니다.

```kotlin
// 문자열을 읽습니다. 예: Charlotte
val name = readln()

// 문자열을 읽고 정수로 변환합니다. 예: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// Hello, Charlotte! You are 43 years old.
```

더 자세한 정보는 [표준 입력 읽기](read-standard-input.md)를 참고하세요.