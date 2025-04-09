---
title: "코딩 컨벤션"
---
일반적으로 알려져 있고 따르기 쉬운 코딩 컨벤션은 모든 프로그래밍 언어에 필수적입니다.
여기서는 Kotlin을 사용하는 프로젝트의 코드 스타일 및 코드 구성에 대한 지침을 제공합니다.

## IDE에서 스타일 구성하기

Kotlin에서 가장 인기 있는 IDE 두 가지인 [IntelliJ IDEA](https://www.jetbrains.com/idea/)와 [Android Studio](https://developer.android.com/studio/)는
코드 스타일링에 대한 강력한 지원을 제공합니다. 주어진 코드 스타일과 일관성을 유지하도록 코드를 자동으로 포맷하도록 구성할 수 있습니다.

### 스타일 가이드 적용하기

1. **Settings/Preferences | Editor | Code Style | Kotlin**으로 이동합니다.
2. **Set from...**을 클릭합니다.
3. **Kotlin style guide**를 선택합니다.

### 코드 스타일 가이드를 따르는지 확인하기

1. **Settings/Preferences | Editor | Inspections | General**로 이동합니다.
2. **Incorrect formatting** 검사를 켭니다.
스타일 가이드에 설명된 다른 문제(예: 명명 규칙)를 확인하는 추가 검사는 기본적으로 활성화됩니다.

## 소스 코드 구성

### 디렉터리 구조

순수 Kotlin 프로젝트에서 권장되는 디렉터리 구조는 일반적인 루트 패키지를 생략한 패키지 구조를 따릅니다. 예를 들어 프로젝트의 모든 코드가 `org.example.kotlin` 패키지 및 해당 하위 패키지에 있는 경우 `org.example.kotlin` 패키지가 있는 파일은 소스 루트 바로 아래에 배치해야 하고,
`org.example.kotlin.network.socket`의 파일은 소스 루트의 `network/socket` 하위 디렉터리에 있어야 합니다.

:::note
JVM에서: Kotlin이 Java와 함께 사용되는 프로젝트에서 Kotlin 소스 파일은 Java 소스 파일과 동일한
소스 루트에 있어야 하고, 동일한 디렉터리 구조를 따라야 합니다. 각 파일은 각 패키지 문에 해당하는
디렉터리에 저장해야 합니다.

:::

### 소스 파일 이름

Kotlin 파일에 단일 클래스 또는 인터페이스(관련 최상위 수준 선언 포함 가능)가 포함된 경우 해당 이름은
클래스 이름과 동일해야 하며, `.kt` 확장자가 추가됩니다. 이는 모든 유형의 클래스와 인터페이스에 적용됩니다.
파일에 여러 클래스가 포함되어 있거나 최상위 수준 선언만 포함되어 있는 경우 파일에 포함된 내용을 설명하는 이름을 선택하고 그에 따라 파일 이름을 지정합니다.
각 단어의 첫 글자를 대문자로 표시하는 [Upper Camel Case](https://en.wikipedia.org/wiki/Camel_case)를 사용합니다.
예: `ProcessDeclarations.kt`.

파일 이름은 파일의 코드가 수행하는 작업을 설명해야 합니다. 따라서 파일 이름에 `Util`과 같이 의미 없는
단어를 사용하지 않아야 합니다.

#### 멀티 플랫폼 프로젝트

멀티 플랫폼 프로젝트에서 플랫폼별 소스 세트의 최상위 수준 선언이 있는 파일에는 소스 세트 이름과 관련된 접미사가 있어야 합니다. 예:

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

공통 소스 세트의 경우 최상위 수준 선언이 있는 파일에 접미사가 없어야 합니다. 예: `commonMain/kotlin/Platform.kt`.

##### 기술적 세부 사항

JVM 제한 사항으로 인해 멀티 플랫폼 프로젝트에서 이 파일 이름 지정 체계를 따르는 것이 좋습니다. JVM은
최상위 수준 멤버(함수, 속성)를 허용하지 않습니다.

이를 해결하기 위해 Kotlin JVM 컴파일러는 최상위 수준
멤버 선언을 포함하는 래퍼 클래스("파일 파사드"라고 함)를 만듭니다. 파일 파사드는 파일 이름에서 파생된 내부 이름을 갖습니다.

결과적으로 JVM은 정규화된 이름(FQN)이 동일한 여러 클래스를 허용하지 않습니다. 이로 인해
Kotlin 프로젝트를 JVM으로 컴파일할 수 없는 상황이 발생할 수 있습니다.

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

여기서 두 개의 `Platform.kt` 파일은 모두 동일한 패키지에 있으므로 Kotlin JVM 컴파일러는 두 개의 파일 파사드를 생성하며, 둘 다
FQN `myPackage.PlatformKt`를 갖습니다. 이렇게 하면 "Duplicate JVM classes" 오류가 발생합니다.

이를 방지하는 가장 간단한 방법은 위에 나와 있는 지침에 따라 파일 중 하나의 이름을 바꾸는 것입니다. 이 명명 체계는
코드 가독성을 유지하면서 충돌을 피하는 데 도움이 됩니다.

:::note
이러한 권장 사항이 중복되어 보일 수 있는 두 가지 시나리오가 있지만 여전히 따르는 것이 좋습니다.

* JVM이 아닌 플랫폼에는 파일 파사드 복제 문제가 없습니다. 그러나 이 명명 체계는 파일
이름 지정을 일관되게 유지하는 데 도움이 될 수 있습니다.
* JVM에서 소스 파일에 최상위 수준 선언이 없으면 파일 파사드가 생성되지 않으므로
명명 충돌이 발생하지 않습니다.

  그러나 이 명명 체계는 간단한 리팩터링 또는 추가로
최상위 수준 함수를 포함하고 동일한 "Duplicate JVM classes" 오류가 발생하는 상황을 방지하는 데 도움이 될 수 있습니다.

### 소스 파일 구성

여러 선언(클래스, 최상위 수준 함수 또는 속성)을 동일한 Kotlin 소스 파일에 배치하는 것이 좋습니다.
이러한 선언이 의미상 서로 밀접하게 관련되어 있고 파일 크기가 합리적인 범위 내에 있는 한(수백 줄을 초과하지 않음).

특히, 이 클래스의 모든 클라이언트에 관련된 클래스에 대한 확장 함수를 정의하는 경우
클래스 자체와 동일한 파일에 넣습니다. 특정 클라이언트에만 의미 있는 확장 함수를 정의하는 경우
해당 클라이언트의 코드 옆에 넣습니다. 일부 클래스의 모든 확장을 보관하기 위해 파일을 만들지 마십시오.

### 클래스 레이아웃

클래스 내용은 다음 순서로 진행되어야 합니다.

1. 속성 선언 및 이니셜라이저 블록
2. 보조 생성자
3. 메서드 선언
4. 컴패니언 객체

메서드 선언을 알파벳순으로 또는 가시성에 따라 정렬하지 말고 일반 메서드를
확장 메서드와 분리하지 마십시오. 대신 관련 항목을 함께 배치하여 클래스를 위에서 아래로 읽는 사람이
발생하는 논리를 따를 수 있도록 합니다. 순서(상위 수준 항목을 먼저 또는 그 반대)를 선택하고 고수합니다.

중첩된 클래스를 해당 클래스를 사용하는 코드 옆에 놓습니다. 클래스가 외부에서 사용하도록 설계되었고 클래스 내부에서
참조되지 않는 경우 컴패니언 객체 뒤에 마지막에 넣습니다.

### 인터페이스 구현 레이아웃

인터페이스를 구현할 때 인터페이스의 멤버와 동일한 순서로 구현 멤버를 유지합니다(필요한 경우
구현에 사용되는 추가 개인 메서드가 섞여 있음).

### 오버로드 레이아웃

항상 클래스에서 오버로드를 서로 옆에 놓습니다.

## 명명 규칙

Kotlin의 패키지 및 클래스 명명 규칙은 매우 간단합니다.

* 패키지 이름은 항상 소문자이고 밑줄을 사용하지 않습니다(`org.example.project`). 다중 단어
이름을 사용하는 것은 일반적으로 권장되지 않지만 여러 단어를 사용해야 하는 경우 단어를 함께 연결하거나
Camel Case(`org.example.myProject`)를 사용할 수 있습니다.

* 클래스 및 객체 이름은 Upper Camel Case를 사용합니다.

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 함수 이름

함수, 속성 및 지역 변수의 이름은 소문자로 시작하고 밑줄 없이 Camel Case를 사용합니다.

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

예외: 클래스 인스턴스를 만드는 데 사용되는 팩터리 함수는 추상 반환 유형과 동일한 이름을 가질 수 있습니다.

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### 테스트 메서드 이름

테스트에서(**테스트에서만**) 백틱으로 묶인 공백이 있는 메서드 이름을 사용할 수 있습니다.
이러한 메서드 이름은 API 레벨 30부터 Android 런타임에서만 지원됩니다. 메서드 이름의 밑줄도
테스트 코드에서 허용됩니다.

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### 속성 이름

상수 이름(`const`로 표시된 속성 또는 사용자 지정 `get` 함수가 없는 최상위 수준 또는 객체 `val` 속성)
깊이 변경할 수 없는 데이터를 보유하는 경우 ([스크리밍 스네이크 케이스](https://en.wikipedia.org/wiki/Snake_case)) 규칙에 따라
모두 대문자, 밑줄로 구분된 이름을 사용해야 합니다.

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

동작 또는 변경 가능한 데이터가 있는 객체를 보유하는 최상위 수준 또는 객체 속성의 이름은 Camel Case 이름을 사용해야 합니다.

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

싱글톤 객체에 대한 참조를 보유하는 속성의 이름은 `object` 선언과 동일한 명명 스타일을 사용할 수 있습니다.

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

열거형 상수의 경우 용도에 따라 모두 대문자, 밑줄로 구분된 이름([스크리밍 스네이크 케이스](https://en.wikipedia.org/wiki/Snake_case)) 이름
(`enum class Color { RED, GREEN }`) 또는 Upper Camel Case 이름을 사용할 수 있습니다.

### 백업 속성 이름

클래스에 개념적으로 동일하지만 하나는 공용 API의 일부이고 다른 하나는 구현
세부 정보인 두 개의 속성이 있는 경우 개인 속성 이름의 접두사로 밑줄을 사용합니다.

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 좋은 이름을 선택하기

클래스 이름은 일반적으로 클래스가 _무엇인지_ 설명하는 명사 또는 명사구입니다. `List`, `PersonReader`.

메서드 이름은 일반적으로 메서드가 _수행하는 작업_을 나타내는 동사 또는 동사구입니다. `close`, `readPersons`.
메서드가 객체를 변경하는지 아니면 새 객체를 반환하는지도 제안해야 합니다. 예를 들어 `sort`는
컬렉션을 제자리에서 정렬하는 반면 `sorted`는 정렬된 컬렉션 복사본을 반환합니다.

이름은 엔터티의 목적을 명확하게 해야 하므로 이름에 의미 없는 단어
(`Manager`, `Wrapper`)를 사용하지 않는 것이 가장 좋습니다.

약어를 선언 이름의 일부로 사용하는 경우 다음 규칙을 따르십시오.

* 두 글자 약어의 경우 두 글자 모두 대문자를 사용합니다. 예를 들어 `IOStream`입니다.
* 두 글자보다 긴 약어의 경우 첫 글자만 대문자로 표시합니다. 예를 들어 `XmlFormatter` 또는 `HttpInputStream`입니다.

## 서식 지정

### 들여쓰기

들여쓰기에 4개의 공백을 사용합니다. 탭을 사용하지 마십시오.

중괄호의 경우 구성이 시작되는 줄 끝에 여는 중괄호를 넣고 닫는 중괄호는
여는 구성과 수평으로 정렬된 별도의 줄에 넣습니다.

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

Kotlin에서 세미콜론은 선택 사항이므로 줄 바꿈은 중요합니다. 언어 디자인은
Java 스타일 중괄호를 가정하며 다른 서식 스타일을 사용하려고 하면 놀라운 동작이 발생할 수 있습니다.

:::

### 가로 공백

* 이항 연산자 주위에 공백을 넣습니다(`a + b`). 예외: "범위 지정" 연산자 주위에 공백을 넣지 마십시오(`0..i`).
* 단항 연산자 주위에 공백을 넣지 마십시오(`a++`).
* 제어 흐름 키워드(`if`, `when`, `for` 및 `while`)와 해당 여는 괄호 사이에 공백을 넣습니다.
* 기본 생성자 선언, 메서드 선언 또는 메서드 호출에서 여는 괄호 앞에 공백을 넣지 마십시오.

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* 절대 `(`, `[` 뒤나 `]`, `)` 앞에 공백을 넣지 마십시오.
* 절대 `.` 또는 `?.` 주위에 공백을 넣지 마십시오. `foo.bar().filter { it > 2 }.joinToString()`, `foo?.bar()`.
* `//` 뒤에 공백을 넣습니다. `// This is a comment`.
* 형식 매개 변수를 지정하는 데 사용되는 꺾쇠 괄호 주위에 공백을 넣지 마십시오. `class Map<K, V> { ... }`.
* `::` 주위에 공백을 넣지 마십시오. `Foo::class`, `String::length`.
* nullable 형식을 표시하는 데 사용되는 `?` 앞에 공백을 넣지 마십시오. `String?`.

일반적으로 모든 종류의 가로 정렬을 피하십시오. 식별자의 이름을 길이가 다른 이름으로 바꾸어도
선언 또는 사용법의 서식에 영향을 미치지 않아야 합니다.

### 콜론

다음 시나리오에서 `:` 앞에 공백을 넣습니다.

* 형식을 슈퍼타입과 분리하는 데 사용되는 경우.
* 수퍼클래스 생성자 또는 동일한 클래스의 다른 생성자에 위임하는 경우.
* `object` 키워드 뒤에.

선언과 해당 형식을 분리할 때는 `:` 앞에 공백을 넣지 마십시오.

항상 `:` 뒤에 공백을 넣습니다.

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }
    
    val x = object : IFoo { /*...*/ } 
} 
```

### 클래스 헤더

기본 생성자 매개 변수가 몇 개 있는 클래스는 한 줄로 작성할 수 있습니다.

```kotlin
class Person(id: Int, name: String)
```

헤더가 더 긴 클래스는 각 기본 생성자 매개 변수가 들여쓰기와 함께 별도의 줄에 있도록 서식을 지정해야 합니다.
또한 닫는 괄호는 새 줄에 있어야 합니다. 상속을 사용하는 경우 수퍼클래스 생성자 호출 또는
구현된 인터페이스 목록은 괄호와 동일한 줄에 있어야 합니다.

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

여러 인터페이스의 경우 수퍼클래스 생성자 호출이 먼저 있어야 하고 각 인터페이스는
다른 줄에 있어야 합니다.

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

수퍼타입 목록이 긴 클래스의 경우 콜론 뒤에 줄 바꿈을 넣고 모든 수퍼타입 이름을 수평으로 정렬합니다.

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

클래스 헤더가 긴 경우 클래스 헤더와 본문을 명확하게 분리하려면 클래스 헤더 뒤에 빈 줄을 넣거나
(위 예와 같이) 여는 중괄호를 별도의 줄에 넣습니다.

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

생성자 매개 변수에는 일반 들여쓰기(4개의 공백)를 사용합니다. 이렇게 하면 기본 생성자에서 선언된 속성이 클래스 본문에서 선언된 속성과 동일한 들여쓰기를 갖습니다.

### 수정자 순서

선언에 여러 수정자가 있는 경우 항상 다음 순서로 넣습니다.

```kotlin
public / protected / private / internal
expect / actual
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation / fun // `fun interface`의 수정자로
companion
inline / value
infix
operator
data
```

모든 주석을 수정자 앞에 배치합니다.

```kotlin
@Named("Foo")
private val foo: Foo
```

라이브러리에서 작업하지 않는 한 중복된 수정자(예: `public`)는 생략합니다.

### 주석

주석을 연결된 선언 앞에 별도의 줄에 놓고 동일한 들여쓰기를 사용합니다.

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

인수가 없는 주석은 동일한 줄에 배치할 수 있습니다.

```kotlin
@JsonExclude @JvmField
var x: String
```

인수가 없는 단일 주석은 해당 선언과 동일한 줄에 배치할 수 있습니다.

```kotlin
@Test fun foo() { /*...*/ }
```

### 파일 주석

파일 주석은 파일 주석(있는 경우) 뒤, `package` 문 앞에 배치되고, `package`와 빈 줄로 분리됩니다(파일이 아닌 패키지를 대상으로 한다는 사실을 강조하기 위해).

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 함수

함수 서명이 한 줄에 맞지 않으면 다음 구문을 사용합니다.

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

함수 매개 변수에는 일반 들여쓰기(4개의 공백)를 사용합니다. 이는 생성자 매개 변수와의 일관성을 유지하는 데 도움이 됩니다.

본문이 단일 식으로 구성된 함수에는 식 본문을 사용하는 것이 좋습니다.

```kotlin
fun foo(): Int {     // 나쁨
    return 1 
}

fun foo() = 1        // 좋음
```

### 식 본문

함수에 첫 번째 줄이 선언과 동일한 줄에 맞지 않는 식 본문이 있는 경우 `=` 기호를 첫 번째 줄에 넣고
식 본문을 4개의 공백으로 들여씁니다.

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### 속성

매우 간단한 읽기 전용 속성의 경우 한 줄 서식을 고려하십시오.

```kotlin
val isEmpty: Boolean get() = size == 0
```

더 복잡한 속성의 경우 항상 `get` 및 `set` 키워드를 별도의 줄에 넣습니다.

```kotlin
val foo: String
    get() { /*...*/ }
```

이니셜라이저가 있는 속성의 경우 이니셜라이저가 길면 `=` 기호 뒤에 줄 바꿈을 추가하고
이니셜라이저를 4개의 공백으로 들여씁니다.

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 제어 흐름 문

`if` 또는 `when` 문의 조건이 여러 줄인 경우 항상 문 본문 주위에 중괄호를 사용합니다.
조건의 각 후속 줄을 문 시작을 기준으로 4개의 공백으로 들여씁니다.
조건의 닫는 괄호를 여는 중괄호와 함께 별도의 줄에 넣습니다.

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

이렇게 하면 조건과 문 본문을 정렬하는 데 도움이 됩니다.

`else`, `catch`, `finally` 키워드와 `do-while` 루프의 `while` 키워드를
선행하는 중괄호와 동일한 줄에 넣습니다.

```kotlin
if (condition) {
    // body
} else {
    // else part
}

try {
    // body
} finally {
    // cleanup
}
```

`when` 문에서 분기가 한 줄 이상인 경우 빈 줄로 인접한 case 블록과 분리하는 것을 고려하십시오.

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken `->`
            callback.visitValue(propName, token.value)

        Token.LBRACE `->` { // ...
        }
    }
}
```

짧은 분기는 중괄호 없이 조건과 동일한 줄에 넣습니다.

```kotlin
when (foo) {
    true `->` bar() // 좋음
    false `->` { baz() } // 나쁨
}
```

### 메서드 호출

인수 목록이 긴 경우 여는 괄호 뒤에 줄 바꿈을 넣습니다. 인수를 4개의 공백으로 들여씁니다.
밀접하게 관련된 여러 인수를 동일한 줄에 그룹화합니다.

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

인수 이름과 값을 분리하는 `=` 기호 주위에 공백을 넣습니다.

### 연결된 호출 래핑

연결된 호출을 래핑할 때 `.` 문자 또는 `?.` 연산자를 다음 줄에 놓고 단일 들여쓰기를 사용합니다.

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

체인의 첫 번째 호출은 일반적으로 앞에 줄 바꿈이 있어야 하지만 코드가 더 합리적인 경우 생략해도 됩니다.

### 람다

람다 식에서는 중괄호 주위와 매개 변수를 본문과 분리하는 화살표 주위에 공백을 사용해야 합니다. 호출이 단일 람다를 사용하는 경우 가능하면 괄호 밖에 전달합니다.

```kotlin
list.filter { it > 10 }
```

람다에 레이블을 할당하는 경우 레이블과 여는 중괄호 사이에 공백을 넣지 마십시오.

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

여러 줄 람다에서 매개 변수 이름을 선언할 때 이름을 첫 번째 줄에 넣고 화살표와 줄 바꿈을 따릅니다.

```kotlin
appendCommaSeparated(properties) { prop `->`
    val propertyValue = prop.get(obj)  // ...
}
```

매개 변수 목록이 너무 길어 한 줄에 맞지 않으면 화살표를 별도의 줄에 넣습니다.

```kotlin
foo {
   context: Context,
   environment: Env
   `->`
   context.configureEnv(environment)
}
```

### 후행 쉼표

후행 쉼표는 일련의 요소에서 마지막 항목 뒤에 오는 쉼표 기호입니다.

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 후행 쉼표
)
```

후행 쉼표를 사용하면 다음과 같은 몇 가지 이점이 있습니다.

* 버전 관리 diff를 더 깔끔하게 만듭니다. 모든 초점이 변경된 값에 맞춰집니다.
* 요소를 쉽게 추가하고 재정렬할 수 있습니다. 요소를 조작하는 경우 쉼표를 추가하거나 삭제할 필요가 없습니다.
* 객체 이니셜라이저와 같은 코드 생성을 단순화합니다. 마지막 요소에도 쉼표가 있을 수 있습니다.

후행 쉼표는 전적으로 선택 사항입니다. 쉼표가 없어도 코드는 여전히 작동합니다. Kotlin 스타일 가이드는 선언 사이트에서 후행 쉼표를 사용하는 것을 권장하고 호출 사이트에서는 재량에 맡깁니다.

IntelliJ IDEA 포맷터에서 후행 쉼표를 활성화하려면 **Settings/Preferences | Editor | Code Style | Kotlin**으로 이동하여
**Other** 탭을 열고 **Use trailing comma** 옵션을 선택합니다.

#### 열거형

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 후행 쉼표
}
```

#### 값 인수

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 후행 쉼표
)
val colors = listOf(
    "red",
    "green",
    "blue", // 후행 쉼표
)
```

#### 클래스 속성 및 매개 변수

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 후행 쉼표
)
class Customer(
    val name: String,
    lastName: String, // 후행 쉼표
)
```

#### 함수 값 매개 변수

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // 후행 쉼표
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 후행 쉼표
) {}
fun print(
    vararg quantity: Int,
    description: String, // 후행 쉼표
) {}
```

#### 선택적 유형의 매개 변수(setter 포함)

```kotlin
val sum: (Int, Int, Int) `->` Int = fun(
    x,
    y,
    z, // 후행 쉼표
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### 인덱싱 접미사

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // 후행 쉼표
    ]
```

#### 람다의 매개 변수

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 후행 쉼표
        `->`
        println("1")
    }
    println(x)
}
```

#### when 항목

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 후행 쉼표
        `->` true
    else `->` false
}
```

#### 컬렉션 리터럴(주석에서)

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 후행 쉼표
])
fun run() {}
```

#### 유형 인수

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 후행 쉼표
            >()
}
```

#### 유형 매개 변수

```kotlin
class MyMap<
        MyKey,
        MyValue, // 후행 쉼표
        > {}
```

#### 구조 해체 선언

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 후행 쉼표
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 후행 쉼표
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## 문서 주석

더 긴 문서 주석의 경우 여는 `/**`를 별도의 줄에 놓고 각 후속 줄을
별표로 시작합니다.

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

짧은 주석은 한 줄에 배치할 수 있습니다.

```kotlin
/** This is a short documentation comment. */
```

일반적으로 `@param` 및 `@return` 태그를 사용하지 마십시오. 대신 매개 변수 및 반환 값에 대한 설명을
문서 주석에 직접 통합하고 매개 변수가 언급되는 모든 위치에 링크를 추가합니다. `@param` 및
`@return`은 기본 텍스트 흐름에 맞지 않는 긴 설명이 필요한 경우에만 사용합니다.

```kotlin
// 이렇게 하지 마십시오.

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// 대신 이렇게 하십시오.

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 중복된 구조 피하기

일반적으로 Kotlin의 특정 구문 구성이 선택 사항이고 IDE에서
중복된 것으로 강조 표시되면 코드에서 생략해야 합니다. 불필요한 구문 요소를
단지 "명확성"을 위해 코드에 남겨두지 마십시오.

### Unit 반환 유형

함수가 Unit을 반환하는 경우 반환 유형을 생략해야 합니다.

```kotlin
fun foo() { // 여기서는 ": Unit"이 생략됩니다.

}
```

### 세미콜론

가능하면 세미콜론을 생략합니다.

### 문자열 템플릿

간단한 변수를 문자열 템플릿에 삽입할 때 중괄호를 사용하지 마십시오. 더 긴 식에만 중괄호를 사용하십시오.

```kotlin
println("$name has ${children.size} children")
```

## 언어 기능의 관용적 사용

### 불변성

변경 가능한 데이터보다 변경 불가능한 데이터를 사용하는 것이 좋습니다. 초기화 후 수정되지 않은 경우 항상 지역 변수와 속성을 `var`가 아닌 `val`로 선언합니다.

변경되지 않은 컬렉션을 선언할 때는 항상 변경 불가능한 컬렉션 인터페이스(`Collection`, `List`, `Set`, `Map`)를 사용합니다. 팩터리 함수를 사용하여 컬렉션 인스턴스를 만들 때는 항상 변경 불가능한
컬렉션 유형을 반환하는 함수를 사용하십시오.

```kotlin
// 나쁨: 변경되지 않을 값에 변경 가능한 컬렉션 유형 사용
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// 좋음: 대신 변경 불가능한 컬렉션 유형 사용
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// 나쁨: arrayListOf()는 변경 가능한 컬렉션 유형인 ArrayList<T>를 반환합니다.
val allowedValues = arrayListOf("a", "b", "c")

// 좋음: listOf()는 List<T>를 반환합니다.
val allowedValues = listOf("a", "b", "c")
```

### 기본 매개 변수 값

오버로드된 함수를 선언하는 것보다 기본 매개 변수 값이 있는 함수를 선언하는 것이 좋습니다.

```kotlin
// 나쁨
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// 좋음
fun foo(a: String = "a") { /*...*/ }
```

### 유형 별칭

코드베이스에서 여러 번 사용되는 기능 유형 또는 유형 매개 변수가 있는 유형이 있는 경우 해당 유형에 대한
유형 별칭을 정의하는 것이 좋습니다.

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) `->` Unit
typealias PersonIndex = Map<String, Person>
```

이름 충돌을 피하기 위해 개인 또는 내부 유형 별칭을 사용하는 경우 [패키지 및 가져오기](packages)에 언급된 `import ... as ...`를 사용하는 것이 좋습니다.

### 람다 매개 변수

짧고 중첩되지 않은 람다에서는 매개 변수를 명시적으로 선언하는 대신 `it` 규칙을 사용하는 것이 좋습니다. 매개 변수가 있는 중첩된 람다에서는 항상 매개 변수를 명시적으로 선언합니다.

### 람다의 반환

람다에서 여러 레이블이 지정된 반환을 사용하지 마십시오. 단일 종료 지점을 갖도록 람다를 재구성하는 것을 고려하십시오.
그것이 불가능하거나 충분히 명확하지 않은 경우 람다를 익명 함수로 변환하는 것을 고려하십시오.

람다의 마지막 문에 레이블이 지정된 반환을 사용하지 마십시오.

### 명명된 인수

메서드가 동일한 기본 유형의 여러 매개 변수를 사용하거나 `Boolean` 유형의 매개 변수에 대해 사용하는 경우
모든 매개 변수의 의미가 컨텍스트에서 완전히 명확하지 않은 경우 명명된 인수 구문을 사용합니다.

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 조건문

`try`, `if` 및 `when`의 식 형식을 사용하는 것이 좋습니다.

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 `->` "zero"
    else `->` "nonzero"
}
```

위의 사항은 다음과 같은 것보다 좋습니다.

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 `->` return "zero"
    else `->` return "nonzero"
}    
```

### if 대 when

이항 조건에는 `when` 대신 `if`를 사용하는 것이 좋습니다.
예를 들어 `if`를 사용하여 이 구문을 사용하십시오.

```kotlin
if (x == null) ... else ...
```

`when`을 사용하는 이 구문 대신:

```kotlin
when (x) {
    null `->` // ...
    else `->` // ...
}
```

세 개 이상의 옵션이 있는 경우 `when`을 사용하는 것이 좋습니다.

### when 식의 가드 조건

[가드 조건](control-flow#guard-conditions-in-when-expressions)을 사용하여 `when` 식 또는 문에서 여러 부울 식을 결합할 때는 괄호를 사용합니다.

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty()