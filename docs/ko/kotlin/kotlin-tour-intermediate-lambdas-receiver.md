[//]: # (title: 중급: 리시버를 가진 람다 표현식)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="첫 번째 단계" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="두 번째 단계" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3.svg" width="20" alt="세 번째 단계" /> <strong>리시버를 가진 람다 표현식</strong><br />
        <img src="icon-4-todo.svg" width="20" alt="네 번째 단계" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스와 인터페이스</a><br />
        <img src="icon-5-todo.svg" width="20" alt="다섯 번째 단계" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-todo.svg" width="20" alt="여섯 번째 단계" /> <a href="kotlin-tour-intermediate-open-special-classes.md">열린 클래스와 특수 클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="일곱 번째 단계" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-todo.svg" width="20" alt="여덟 번째 단계" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안정성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="아홉 번째 단계" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

이 장에서는 리시버 객체를 다른 타입의 함수인 람다 표현식과 함께 사용하는 방법과, 이들이 도메인 특화 언어를 만드는 데 어떻게 도움이 되는지 배웁니다.

## 리시버를 가진 람다 표현식

초급 투어에서 [람다 표현식](kotlin-tour-functions.md#lambda-expressions)을 사용하는 방법을 배웠습니다. 람다 표현식은 리시버를 가질 수도 있습니다. 이 경우 람다 표현식은 리시버 객체를 매번 명시적으로 지정할 필요 없이 리시버 객체의 모든 멤버 함수나 프로퍼티에 접근할 수 있습니다. 이러한 추가적인 참조가 없으면 코드를 더 쉽게 읽고 유지보수할 수 있습니다.

> 리시버를 가진 람다 표현식은 리시버를 가진 함수 리터럴로도 알려져 있습니다.
>
{style="tip"}

리시버를 가진 람다 표현식의 구문은 함수 타입을 정의할 때 다릅니다. 먼저 확장하려는 리시버 타입을 작성합니다. 다음으로 `.`을 붙이고 나머지 함수 타입 정의를 완료합니다. 예를 들어:

```kotlin
MutableList<Int>.() -> Unit
```

이 함수 타입은 다음을 가집니다:

*   `MutableList<Int>`를 리시버 타입으로 가집니다.
*   괄호 `()` 안에 함수 파라미터가 없습니다.
*   반환 값 `Unit`이 없습니다.

`StringBuilder` 클래스를 확장하는 다음 예시를 고려해 보세요:

```kotlin
fun main() {
    // 리시버를 가진 람다 표현식 정의
    fun StringBuilder.appendText() { append("Hello!") }

    // 리시버를 가진 람다 표현식 사용
    val stringBuilder = StringBuilder()
    stringBuilder.appendText()
    println(stringBuilder.toString())
    // Hello!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver"}

이 예시에서:

*   `StringBuilder` 클래스가 리시버 타입입니다.
*   람다 표현식의 함수 타입은 함수 파라미터 `()`가 없으며 반환 값 `Unit`이 없습니다.
*   람다 표현식은 `StringBuilder` 클래스의 `append()` 멤버 함수를 호출하고 문자열 `"Hello!"`를 함수 파라미터로 사용합니다.
*   `StringBuilder` 클래스의 인스턴스가 생성됩니다.
*   `appendText`에 할당된 람다 표현식이 `stringBuilder` 인스턴스에 대해 호출됩니다.
*   `stringBuilder` 인스턴스는 `toString()` 함수로 문자열로 변환되어 `println()` 함수를 통해 출력됩니다.

리시버를 가진 람다 표현식은 도메인 특화 언어 (DSL)를 만들고자 할 때 유용합니다. 리시버를 명시적으로 참조하지 않고도 리시버 객체의 멤버 함수 및 프로퍼티에 접근할 수 있으므로 코드가 더욱 간결해집니다.

이를 시연하기 위해, 메뉴의 항목을 구성하는 예시를 고려해 봅시다. `MenuItem` 클래스와 메뉴에 항목을 추가하는 `item()` 함수 및 모든 메뉴 항목의 리스트 `items`를 포함하는 `Menu` 클래스부터 시작하겠습니다:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}
```

시작점으로 메뉴를 빌드하는 `menu()` 함수에 함수 파라미터 (`init`)로 전달된 리시버를 가진 람다 표현식을 사용해 봅시다. 코드가 `StringBuilder` 클래스의 이전 예시와 유사한 접근 방식을 따르는 것을 알 수 있습니다:

```kotlin
fun menu(name: String, init: Menu.() -> Unit): Menu {
    // Menu 클래스의 인스턴스를 생성합니다.
    val menu = Menu(name)
    // 클래스 인스턴스에 대해 리시버 init()을 가진 람다 표현식을 호출합니다.
    menu.init()
    return menu
}
```

이제 DSL을 사용하여 메뉴를 구성하고 메뉴 구조를 콘솔에 출력하는 `printMenu()` 함수를 만들 수 있습니다:

```kotlin
class MenuItem(val name: String)

class Menu(val name: String) {
    val items = mutableListOf<MenuItem>()

    fun item(name: String) {
        items.add(MenuItem(name))
    }
}

fun menu(name: String, init: Menu.() -> Unit): Menu {
    val menu = Menu(name)
    menu.init()
    return menu
}

//sampleStart
fun printMenu(menu: Menu) {
    println("Menu: ${menu.name}")
    menu.items.forEach { println("  Item: ${it.name}") }
}

// DSL 사용
fun main() {
    // 메뉴 생성
    val mainMenu = menu("Main Menu") {
        // 메뉴에 항목 추가
        item("Home")
        item("Settings")
        item("Exit")
    }

    // 메뉴 출력
    printMenu(mainMenu)
    // Menu: Main Menu
    // Item: Home
    // Item: Settings
    // Item: Exit
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-intermediate-tour-lambda-expression-with-receiver-dsl"}

보시다시피, 리시버를 가진 람다 표현식을 사용하면 메뉴를 만드는 데 필요한 코드가 크게 단순화됩니다. 람다 표현식은 설정 및 생성뿐만 아니라 구성에도 유용합니다. API, UI 프레임워크 및 구성 빌더를 위한 DSL을 구축하는 데 일반적으로 사용되어 간결한 코드를 생성하므로 기본 코드 구조 및 논리에 더 쉽게 집중할 수 있습니다.

코틀린의 생태계에는 [표준 라이브러리](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)의 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 및 [`buildString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) 함수와 같은 이 설계 패턴의 많은 예시가 있습니다.

> 리시버를 가진 람다 표현식은 코틀린의 **타입 안전 빌더 (Type-safe builders)**와 결합하여 런타임이 아닌 컴파일 시간에 타입 관련 문제를 감지하는 DSL을 만들 수 있습니다. 더 자세히 알아보려면 [타입 안전 빌더](type-safe-builders.md)를 참조하세요.
>
{style="tip"}

## 연습 문제

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-1"}

리시버를 가진 람다 표현식을 받는 `fetchData()` 함수가 있습니다. 람다 표현식을 업데이트하여 `append()` 함수를 사용하도록 하여 코드의 출력이 `Data received - Processed`가 되도록 하세요.

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        // 여기에 코드를 작성하세요
        // Data received - Processed
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-1"}

|---|---|
```kotlin
fun fetchData(callback: StringBuilder.() -> Unit) {
    val builder = StringBuilder("Data received")
    builder.callback()
}

fun main() {
    fetchData {
        append(" - Processed")
        println(this.toString())
        // Data received - Processed
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-lambda-receivers-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-2"}

`Button` 클래스와 `ButtonEvent`, `Position` 데이터 클래스가 있습니다. `Button` 클래스의 `onEvent()` 멤버 함수를 트리거하여 더블 클릭 이벤트를 발생시키는 코드를 작성하세요. 코드는 `"Double click!"`을 출력해야 합니다.

```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // 더블 클릭 이벤트를 시뮬레이션합니다 (우클릭 아님)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // 이벤트 콜백 트리거
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()

    button.onEvent {
        // 여기에 코드를 작성하세요
        // Double click!
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-2"}

|---|---|
```kotlin
class Button {
    fun onEvent(action: ButtonEvent.() -> Unit) {
        // 더블 클릭 이벤트를 시뮬레이션합니다 (우클릭 아님)
        val event = ButtonEvent(isRightClick = false, amount = 2, position = Position(100, 200))
        event.action() // 이벤트 콜백 트리거
    }
}

data class ButtonEvent(
    val isRightClick: Boolean,
    val amount: Int,
    val position: Position
)

data class Position(
    val x: Int,
    val y: Int
)

fun main() {
    val button = Button()
    
    button.onEvent {
        if (!isRightClick && amount == 2) {
            println("Double click!")
            // Double click!
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-lambda-receivers-solution-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true" id="lambda-receivers-exercise-3"}

각 요소가 1씩 증가된 정수 리스트의 사본을 생성하는 함수를 작성하세요. `List<Int>`를 `incremented` 함수로 확장하는 제공된 함수 스켈레톤을 사용하세요.

```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        // 여기에 코드를 작성하세요
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-receivers-exercise-3"}

|---|---|
```kotlin
fun List<Int>.incremented(): List<Int> {
    val originalList = this
    return buildList {
        for (n in originalList) add(n + 1)
    }
}

fun main() {
    val originalList = listOf(1, 2, 3)
    val newList = originalList.incremented()
    println(newList)
    // [2, 3, 4]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-lambda-receivers-solution-3"}

## 다음 단계

[중급: 클래스와 인터페이스](kotlin-tour-intermediate-classes-interfaces.md)