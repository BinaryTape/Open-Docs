[//]: # (title: 타입 검사 및 캐스트)

코틀린에서는 런타임에 객체의 타입을 확인하기 위해 타입 검사를 수행할 수 있습니다. 타입 캐스트를 사용하면 객체를 다른 타입으로 변환할 수 있습니다.

> **제네릭** 타입 검사 및 캐스트(`List<T>`, `Map<K,V>` 등)에 대해 자세히 알아보려면 [제네릭 타입 검사 및 캐스트](generics.md#generics-type-checks-and-casts)를 참조하세요.
>
{style="tip"}

## `is` 및 `!is` 연산자

객체가 주어진 타입에 부합하는지 런타임에 확인하려면 `is` 연산자 또는 그 부정 형태인 `!is`를 사용합니다.

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // Same as !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## 스마트 캐스트

대부분의 경우, 컴파일러가 객체를 자동으로 캐스트하므로 명시적 캐스트 연산자를 사용할 필요가 없습니다. 이를 스마트 캐스트(smart-casting)라고 합니다. 컴파일러는 변경 불가능한 값에 대한 타입 검사와 [명시적 캐스트](#unsafe-cast-operator)를 추적하고 필요할 때 암시적(안전한) 캐스트를 자동으로 삽입합니다.

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x is automatically cast to String
    }
}
```

컴파일러는 부정 검사 결과로 반환이 이루어지는 경우에도 캐스트가 안전하다는 것을 알 만큼 충분히 똑똑합니다.

```kotlin
if (x !is String) return

print(x.length) // x is automatically cast to String
```

### 제어 흐름

스마트 캐스트는 `if` 조건식뿐만 아니라 [`when` 식](control-flow.md#when-expressions-and-statements) 및 [`while` 루프](control-flow.md#while-loops)에서도 작동합니다.

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

`if`, `when` 또는 `while` 조건에서 사용하기 전에 `Boolean` 타입의 변수를 선언하면, 컴파일러가 해당 변수에 대해 수집한 모든 정보가 스마트 캐스트를 위한 해당 블록에서 접근 가능합니다.

이는 불리언 조건을 변수로 추출하는 등의 작업을 수행할 때 유용합니다. 이렇게 하면 변수에 의미 있는 이름을 부여하여 코드 가독성을 높이고 나중에 코드에서 변수를 재사용할 수 있습니다. 예를 들면 다음과 같습니다.

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 컴파일러는 isCat에 대한 정보에 접근할 수 있으므로, animal이 Cat 타입으로 스마트 캐스트되었음을 압니다.
        // 따라서 purr() 함수를 호출할 수 있습니다.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 논리 연산자

컴파일러는 `&&` 또는 `||` 연산자의 왼쪽에 타입 검사(일반 또는 부정)가 있는 경우, 오른쪽에 스마트 캐스트를 수행할 수 있습니다.

```kotlin
// || 연산자의 오른쪽에 있는 x는 자동으로 String으로 캐스트됩니다.
if (x !is String || x.length == 0) return

// && 연산자의 오른쪽에 있는 x는 자동으로 String으로 캐스트됩니다.
if (x is String && x.length > 0) {
    print(x.length) // x는 자동으로 String으로 캐스트됩니다.
}
```

객체에 대한 타입 검사를 `or` 연산자(`||`)와 결합하면, 가장 가까운 공통 상위 타입으로 스마트 캐스트가 이루어집니다.

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus는 공통 상위 타입 Status로 스마트 캐스트됩니다.
        signalStatus.signal()
    }
}
```

> 공통 상위 타입은 [유니온 타입](https://en.wikipedia.org/wiki/Union_type)의 **근사치**입니다. 유니온 타입은 [현재 코틀린에서 지원되지 않습니다](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

### 인라인 함수

컴파일러는 [인라인 함수](inline-functions.md)에 전달된 람다 함수 내에 캡처된 변수를 스마트 캐스트할 수 있습니다.

인라인 함수는 암시적인 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 계약을 갖는 것으로 취급됩니다. 이는 인라인 함수에 전달된 모든 람다 함수가 그 자리에서 호출됨을 의미합니다. 람다 함수가 그 자리에서 호출되므로 컴파일러는 람다 함수가 함수 본문에 포함된 변수에 대한 참조를 누출할 수 없다는 것을 압니다.

컴파일러는 이 지식과 다른 분석을 사용하여 캡처된 변수 중 어느 것을 스마트 캐스트하는 것이 안전한지 결정합니다. 예를 들면 다음과 같습니다.

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 컴파일러는 processor가 로컬 변수이고 inlineAction()
        // 이 인라인 함수이므로 processor에 대한 참조가 누출될 수 없다는 것을 압니다.
        // 따라서 processor를 스마트 캐스트하는 것이 안전합니다.
      
        // processor가 null이 아니면 processor는 스마트 캐스트됩니다.
        if (processor != null) {
            // 컴파일러는 processor가 null이 아님을 알므로 안전 호출
            // 이 필요하지 않습니다.
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 예외 처리

스마트 캐스트 정보는 `catch` 및 `finally` 블록으로 전달됩니다. 이는 컴파일러가 객체가 널 허용 타입인지 여부를 추적하므로 코드를 더 안전하게 만듭니다. 예를 들면 다음과 같습니다.

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput은 String 타입으로 스마트 캐스트됩니다.
    stringInput = ""
    try {
        // 컴파일러는 stringInput이 null이 아님을 압니다.
        println(stringInput.length)
        // 0

        // 컴파일러는 stringInput에 대한 이전 스마트 캐스트 정보를 거부합니다.
        // 이제 stringInput은 String? 타입을 가집니다.
        stringInput = null

        // 예외 발생
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 컴파일러는 stringInput이 null일 수 있음을 압니다.
        // 따라서 stringInput은 널 허용 상태를 유지합니다.
        println(stringInput?.length)
        // null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### 스마트 캐스트 전제 조건

> 스마트 캐스트는 컴파일러가 변수가 검사와 사용 사이에 변경되지 않을 것을 보장할 수 있는 경우에만 작동한다는 점에 유의하십시오.
>
{style="warning"}

스마트 캐스트는 다음 조건에서 사용할 수 있습니다.

<table style="none">
    <tr>
        <td>
            <code>val</code> 로컬 변수
        </td>
        <td>
            항상, 단 <a href="delegated-properties.md">로컬 위임 속성</a>은 제외합니다.
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 프로퍼티
        </td>
        <td>
            프로퍼티가 <code>private</code>, <code>internal</code>이거나, 해당 프로퍼티가 선언된 동일한 <a href="visibility-modifiers.md#modules">모듈</a>에서 검사가 수행되는 경우. <code>open</code> 프로퍼티 또는 사용자 지정 getter가 있는 프로퍼티에는 스마트 캐스트를 사용할 수 없습니다.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 로컬 변수
        </td>
        <td>
            변수가 검사와 사용 사이에 수정되지 않고, 변수를 수정하는 람다에 캡처되지 않았으며, 로컬 위임 속성이 아닌 경우.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 프로퍼티
        </td>
        <td>
            항상 불가능합니다. 변수가 다른 코드에 의해 언제든지 수정될 수 있기 때문입니다.
        </td>
    </tr>
</table>

## "안전하지 않은" 캐스트 연산자

객체를 널이 아닌 타입으로 명시적으로 캐스트하려면 *안전하지 않은* 캐스트 연산자 `as`를 사용합니다.

```kotlin
val x: String = y as String
```

캐스트가 불가능한 경우 컴파일러는 예외를 발생시킵니다. 이것이 _안전하지 않다고_ 불리는 이유입니다.

이전 예시에서 `y`가 `null`이면 위 코드는 예외를 발생시킵니다. 이는 `String`이 [널 허용](null-safety.md)이 아니므로 `null`을 `String`으로 캐스트할 수 없기 때문입니다. 가능한 널 값을 처리하기 위해 예시가 작동하도록 하려면 캐스트의 오른쪽에 널 허용 타입을 사용합니다.

```kotlin
val x: String? = y as String?
```

## "안전한" (널 허용) 캐스트 연산자

예외를 피하려면 실패 시 `null`을 반환하는 *안전한* 캐스트 연산자 `as?`를 사용합니다.

```kotlin
val x: String? = y as? String
```

`as?`의 오른쪽이 널이 아닌 타입 `String`임에도 불구하고 캐스트 결과는 널 허용 타입이라는 점에 유의하십시오.