[//]: # (title: 부호 없는 정수 타입)

[정수 타입](numbers.md#integer-types) 외에도 Kotlin은 부호 없는 정수를 위한 다음 타입들을 제공합니다:

| Type     | Size (bits) | 최솟값 | 최댓값                                       |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |

부호 없는 타입은 해당 부호 있는 타입의 대부분의 연산을 지원합니다.

> 부호 없는 숫자는 [인라인 클래스](inline-classes.md)로 구현되며, 해당 부호 있는 타입과 동일한 너비를 가진 단일 스토리지 프로퍼티를 포함합니다. 부호 없는 정수 타입과 부호 있는 정수 타입 간에 변환하려면, 함수 호출 및 연산이 새 타입을 지원하도록 코드를 업데이트해야 합니다.
>
{style="note"}

## 부호 없는 배열과 범위

> 부호 없는 배열과 이에 대한 연산은 [베타](components-stability.md) 상태입니다. 언제든지 호환되지 않게 변경될 수 있습니다. 옵트인(Opt-in)이 필요합니다 (자세한 내용은 아래 참조).
>
{style="warning"}

기본 타입(primitives)과 마찬가지로, 각 부호 없는 타입은 해당 타입의 배열을 나타내는 상응하는 타입을 가집니다:

* `UByteArray`: 부호 없는 바이트 배열.
* `UShortArray`: 부호 없는 쇼트 배열.
* `UIntArray`: 부호 없는 인트 배열.
* `ULongArray`: 부호 없는 롱 배열.

부호 있는 정수 배열과 마찬가지로, 이들은 `Array` 클래스와 유사한 API를 제공하며 박싱 오버헤드가 없습니다.

부호 없는 배열을 사용하면 이 기능이 아직 안정적이지 않다는 경고를 받게 됩니다. 경고를 제거하려면 `@ExperimentalUnsignedTypes` 어노테이션으로 옵트인(opt-in)해야 합니다. 클라이언트가 API 사용에 명시적으로 옵트인해야 하는지 여부는 개발자의 판단에 달렸지만, 부호 없는 배열은 안정적인 기능이 아니므로, 이를 사용하는 API는 언어 변경으로 인해 깨질 수 있다는 점을 명심하십시오. [옵트인 요구사항에 대해 더 알아보기](opt-in-requirements.md).

`UIntRange`, `UIntProgression`, `ULongRange`, `ULongProgression` 클래스에 의해 `UInt`와 `ULong`에 대해 [범위와 진행](ranges.md)이 지원됩니다. 부호 없는 정수 타입과 함께, 이 클래스들은 안정적입니다.

## 부호 없는 정수 리터럴

부호 없는 정수를 더 쉽게 사용하기 위해, 정수 리터럴에 특정 부호 없는 타입을 나타내는 접미사를 추가할 수 있습니다 (Float의 `F`나 Long의 `L`과 유사하게):

* `u` 및 `U` 문자는 정확한 타입을 지정하지 않고 부호 없는 리터럴을 나타냅니다.
    예상되는 타입이 제공되지 않으면, 컴파일러는 리터럴의 크기에 따라 `UInt` 또는 `ULong`을 사용합니다:

    ```kotlin
    val b: UByte = 1u  // UByte, expected type provided
    val s: UShort = 1u // UShort, expected type provided
    val l: ULong = 1u  // ULong, expected type provided
  
    val a1 = 42u // UInt: no expected type provided, constant fits in UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
    ```

* `uL` 및 `UL`은 리터럴이 부호 없는 롱이어야 함을 명시적으로 지정합니다:

    ```kotlin
    val a = 1UL // ULong, even though no expected type provided and the constant fits into UInt
    ```

## 사용 사례

부호 없는 숫자의 주요 사용 사례는 정수의 전체 비트 범위를 활용하여 양수 값을 표현하는 것입니다.
예를 들어, 32비트 `AARRGGBB` 형식의 색상과 같이 부호 있는 타입에 맞지 않는 16진수 상수를 표현하는 데 사용됩니다:

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

부호 없는 숫자를 사용하여 명시적인 `toByte()` 리터럴 캐스트 없이도 바이트 배열을 초기화할 수 있습니다:

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

또 다른 사용 사례는 네이티브 API와의 상호 운용성입니다. Kotlin은 시그니처에 부호 없는 타입을 포함하는 네이티브 선언을 나타낼 수 있도록 합니다. 매핑은 부호 없는 정수를 부호 있는 정수로 대체하지 않고 의미론을 그대로 유지합니다.

### 비목표

부호 없는 정수는 양수와 0만 나타낼 수 있지만, 애플리케이션 도메인에서 음수가 아닌 정수가 필요한 곳에 이들을 사용하는 것은 목표가 아닙니다. 예를 들어, 컬렉션 크기나 컬렉션 인덱스 값의 타입으로 사용하는 경우입니다.

몇 가지 이유가 있습니다:

* 부호 있는 정수를 사용하면 의도치 않은 오버플로우를 감지하고 오류 조건을 알리는 데 도움이 될 수 있습니다. 예를 들어 빈 리스트의 경우 [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html)가 -1인 경우입니다.
* 부호 없는 정수는 부호 있는 정수의 값 범위의 부분집합이 아니기 때문에, 부호 있는 정수의 범위 제한 버전으로 취급될 수 없습니다. 부호 있는 정수도, 부호 없는 정수도 서로의 서브타입이 아닙니다.