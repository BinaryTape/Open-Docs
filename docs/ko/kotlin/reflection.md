[//]: # (title: 리플렉션)

_리플렉션_은 런타임에 프로그램의 구조를 살펴볼 수 있게 해주는 언어 및 라이브러리 기능 모음입니다.
함수와 프로퍼티는 Kotlin에서 일급 시민(first-class citizens)이며, 이들을 내부적으로 들여다보는 기능(예: 런타임에 프로퍼티나 함수의 이름 또는 타입을 알아내는 것)은
함수형 또는 반응형(reactive) 스타일을 사용할 때 필수적입니다.

> Kotlin/JS는 리플렉션 기능을 제한적으로 지원합니다. [Kotlin/JS의 리플렉션에 대해 자세히 알아보기](js-reflection.md).
>
{style="note"}

## JVM 의존성

JVM 플랫폼에서 Kotlin 컴파일러 배포판은 리플렉션 기능을 사용하는 데 필요한 런타임 구성 요소를 별도의 아티팩트인 `kotlin-reflect.jar`로 포함합니다. 이는 리플렉션 기능을 사용하지 않는 애플리케이션의 런타임 라이브러리 크기를 줄이기 위함입니다.

Gradle 또는 Maven 프로젝트에서 리플렉션을 사용하려면 `kotlin-reflect`에 대한 의존성을 추가하세요.

*   Gradle에서:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation(kotlin("reflect"))
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-reflect:%kotlinVersion%"
    }
    ```

    </tab>
    </tabs>

*   Maven에서:

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-reflect</artifactId>
        </dependency>
    </dependencies>
    ```

Gradle 또는 Maven을 사용하지 않는 경우, 프로젝트의 클래스패스(classpath)에 `kotlin-reflect.jar`가 있는지 확인하세요.
다른 지원되는 경우(명령줄 컴파일러 또는 Ant를 사용하는 IntelliJ IDEA 프로젝트)에는 기본적으로 추가됩니다. 명령줄 컴파일러 및 Ant에서는 `-no-reflect` 컴파일러 옵션을 사용하여 클래스패스에서 `kotlin-reflect.jar`를 제외할 수 있습니다.

## 클래스 참조

가장 기본적인 리플렉션 기능은 Kotlin 클래스에 대한 런타임 참조를 얻는 것입니다.
정적으로 알려진 Kotlin 클래스에 대한 참조를 얻으려면 _클래스 리터럴(class literal)_ 구문을 사용할 수 있습니다.

```kotlin
val c = MyClass::class
```

이 참조는 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/index.html) 타입 값입니다.

>JVM에서: Kotlin 클래스 참조는 Java 클래스 참조와 다릅니다. Java 클래스 참조를 얻으려면 `KClass` 인스턴스에서 `.java` 프로퍼티를 사용하세요.
>
{style="note"}

### 바운드 클래스 참조

객체를 리시버(receiver)로 사용하여 동일한 `::class` 구문으로 특정 객체의 클래스 참조를 얻을 수 있습니다.

```kotlin
val widget: Widget = ...
assert(widget is GoodWidget) { "Bad widget: ${widget::class.qualifiedName}" }
```

리시버 표현식의 타입(`Widget`)에 관계없이 객체의 정확한 클래스(예: `GoodWidget` 또는 `BadWidget`)에 대한 참조를 얻게 됩니다.

## 호출 가능 참조

함수, 프로퍼티 및 생성자에 대한 참조는 [함수 타입](lambdas.md#function-types)의 인스턴스로 호출하거나 사용할 수 있습니다.

모든 호출 가능 참조의 공통 상위 타입은 [`KCallable<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-callable/index.html)이며, 여기서 `R`은 반환 값 타입입니다. 프로퍼티의 경우 프로퍼티 타입이고, 생성자의 경우 생성된(constructed) 타입입니다.

### 함수 참조

아래와 같이 선언된 이름 지정 함수가 있을 때, 직접 호출할 수 있습니다(`isOdd(5)`):

```kotlin
fun isOdd(x: Int) = x % 2 != 0
```

또는 함수를 함수 타입 값으로 사용할 수 있습니다. 즉, 다른 함수에 전달할 수 있습니다. 이렇게 하려면 `::` 연산자를 사용하세요.

```kotlin
fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

여기서 `::isOdd`는 `(Int) -> Boolean` 함수 타입의 값입니다.

함수 참조는 매개변수 개수에 따라 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 서브타입 중 하나에 속합니다. 예를 들어, `KFunction3<T1, T2, T3, R>`과 같습니다.

`::`는 예상 타입이 컨텍스트에서 알려진 경우 오버로드된 함수와 함께 사용할 수 있습니다.
예를 들어:

```kotlin
fun main() {
//sampleStart
    fun isOdd(x: Int) = x % 2 != 0
    fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"

    val numbers = listOf(1, 2, 3)
    println(numbers.filter(::isOdd)) // isOdd(x: Int)를 참조합니다.
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또는 명시적으로 지정된 타입을 사용하여 변수에 메서드 참조를 저장함으로써 필요한 컨텍스트를 제공할 수 있습니다.

```kotlin
val predicate: (String) -> Boolean = ::isOdd   // isOdd(x: String)를 참조합니다.
```

클래스의 멤버 또는 확장 함수를 사용해야 하는 경우, 이를 한정해야 합니다(`String::toCharArray`).

확장 함수에 대한 참조로 변수를 초기화하더라도, 추론된 함수 타입에는 리시버가 없습니다. 하지만 리시버 객체를 받는 추가 매개변수가 있습니다. 대신 리시버가 있는 함수 타입을 가지려면 타입을 명시적으로 지정하세요.

```kotlin
val isEmptyStringList: List<String>.() -> Boolean = List<String>::isEmpty
```

#### 예시: 함수 합성

다음 함수를 고려하세요.

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}
```

이 함수는 전달된 두 함수의 합성을 반환합니다: `compose(f, g) = f(g(*))`.
이 함수를 호출 가능 참조에 적용할 수 있습니다.

```kotlin
fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
    return { x -> f(g(x)) }
}

fun isOdd(x: Int) = x % 2 != 0

fun main() {
//sampleStart
    fun length(s: String) = s.length

    val oddLength = compose(::isOdd, ::length)
    val strings = listOf("a", "ab", "abc")

    println(strings.filter(oddLength))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 프로퍼티 참조

Kotlin에서 프로퍼티를 일급 객체로 접근하려면 `::` 연산자를 사용하세요.

```kotlin
val x = 1

fun main() {
    println(::x.get())
    println(::x.name)
}
```

`::x` 표현식은 `KProperty0<Int>` 타입의 프로퍼티 객체로 평가됩니다. `get()`을 사용하여 값을 읽거나 `name` 프로퍼티를 사용하여 프로퍼티 이름을 검색할 수 있습니다. 자세한 내용은 [`KProperty` 클래스에 대한 문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html)를 참조하세요.

`var y = 1`과 같은 변경 가능한(mutable) 프로퍼티의 경우, `::y`는 `set()` 메서드를 가진 [`KMutableProperty0<Int>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-mutable-property/index.html) 타입의 값을 반환합니다.

```kotlin
var y = 1

fun main() {
    ::y.set(2)
    println(y)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

프로퍼티 참조는 단일 제네릭 매개변수가 예상되는 함수가 필요한 곳에 사용될 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val strs = listOf("a", "bc", "def")
    println(strs.map(String::length))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

클래스 멤버인 프로퍼티에 접근하려면 다음과 같이 한정하세요.

```kotlin
fun main() {
//sampleStart
    class A(val p: Int)
    val prop = A::p
    println(prop.get(A(1)))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

확장 프로퍼티의 경우:

```kotlin
val String.lastChar: Char
    get() = this[length - 1]

fun main() {
    println(String::lastChar.get("abc"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Java 리플렉션과의 상호 운용성

JVM 플랫폼에서 표준 라이브러리는 Java 리플렉션 객체로의 매핑 및 역매핑을 제공하는 리플렉션 클래스에 대한 확장(패키지 `kotlin.reflect.jvm` 참조)을 포함합니다.
예를 들어, Kotlin 프로퍼티의 배킹 필드(backing field)나 getter 역할을 하는 Java 메서드를 찾으려면 다음과 같이 작성할 수 있습니다.

```kotlin
import kotlin.reflect.jvm.*

class A(val p: Int)

fun main() {
    println(A::p.javaGetter) // "public final int A.getP()"를 출력합니다.
    println(A::p.javaField)  // "private final int A.p"를 출력합니다.
}
```

Java 클래스에 해당하는 Kotlin 클래스를 얻으려면 `.kotlin` 확장 프로퍼티를 사용하세요.

```kotlin
fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin
```

### 생성자 참조

생성자는 메서드 및 프로퍼티와 마찬가지로 참조할 수 있습니다. 생성자와 동일한 매개변수를 받고 적절한 타입의 객체를 반환하는 함수 타입 객체가 필요한 모든 곳에서 사용할 수 있습니다.
생성자는 `::` 연산자와 클래스 이름을 추가하여 참조합니다. 매개변수가 없고 반환 타입이 `Foo`인 함수 매개변수를 예상하는 다음 함수를 고려하세요.

```kotlin
class Foo

fun function(factory: () -> Foo) {
    val x: Foo = factory()
}
```

`::Foo`, 즉 `Foo` 클래스의 인자 없는(zero-argument) 생성자를 사용하여 다음과 같이 호출할 수 있습니다.

```kotlin
function(::Foo)
```

생성자에 대한 호출 가능 참조는 매개변수 개수에 따라 [`KFunction<out R>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-function/index.html) 서브타입 중 하나로 타입이 지정됩니다.

### 바운드 함수 및 프로퍼티 참조

특정 객체의 인스턴스 메서드를 참조할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    println(numberRegex.matches("29"))

    val isNumber = numberRegex::matches
    println(isNumber("29"))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`matches` 메서드를 직접 호출하는 대신, 예제에서는 해당 메서드에 대한 참조를 사용합니다.
이러한 참조는 해당 리시버에 바인딩됩니다.
직접 호출하거나(위 예시처럼) 함수 타입 표현식이 예상되는 모든 곳에서 사용할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numberRegex = "\\d+".toRegex()
    val strings = listOf("abc", "124", "a70")
    println(strings.filter(numberRegex::matches))
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

바운드 참조와 언바운드 참조의 타입을 비교해 보세요.
바운드 호출 가능 참조는 리시버가 "붙어" 있으므로 리시버 타입이 더 이상 매개변수가 아닙니다.

```kotlin
val isNumber: (CharSequence) -> Boolean = numberRegex::matches

val matches: (Regex, CharSequence) -> Boolean = Regex::matches
```

프로퍼티 참조도 바인딩될 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val prop = "abc"::length
    println(prop.get())
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`this`를 리시버로 지정할 필요가 없습니다. `this::foo`와 `::foo`는 동일합니다.

### 바운드 생성자 참조

[내부 클래스(inner class)](nested-classes.md#inner-classes)의 생성자에 대한 바운드 호출 가능 참조는 외부 클래스의 인스턴스를 제공함으로써 얻을 수 있습니다.

```kotlin
class Outer {
    inner class Inner
}

val o = Outer()
val boundInnerCtor = o::Inner