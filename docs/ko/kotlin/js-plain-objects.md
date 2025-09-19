[//]: # (title: JS 일반 객체 컴파일러 플러그인)

<primary-label ref="experimental-general"/>

JavaScript (JS) 일반 객체 컴파일러 플러그인(`js-plain-objects`)을 사용하면 타입 안전한 방식으로 일반 JS 객체를 생성하고 복사할 수 있습니다.

여기서는 일반 JS 객체에 대한 정보와 Kotlin/JS 프로젝트에서 `js-plain-objects` 컴파일러 플러그인을 사용하는 방법을 찾을 수 있습니다.

> `js-plain-objects` 플러그인은 새로운 K2 Kotlin 컴파일러에서만 작동합니다.
>
{style="warning"}

## 일반 JS 객체

일반 객체는 객체 리터럴 (`{}`)을 통해 생성되며 데이터 프로퍼티를 포함하는 간단한 JS 객체입니다.
많은 JS API는 구성이나 데이터 교환을 위해 일반 JS 객체를 받거나 반환합니다.

`js-plain-objects` 플러그인을 사용하면 객체 형태를 설명하는 Kotlin 외부 인터페이스를 선언하고 `@JsPlainObject`로 어노테이션을 지정할 수 있습니다.
컴파일러는 Kotlin 타입 안전성을 유지하면서 이러한 객체를 빌드하고 복사하는 편리한 함수를 생성합니다.

## 플러그인 활성화

다음 Kotlin DSL이 보여주듯이, `js-plain-objects` 플러그인을 프로젝트의 Gradle 설정 파일에 추가하세요:

<tabs group="js-plain-objects">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.js-plain-objects") version "%kotlinVersion%"
}

kotlin {
    js {
        browser() // 또는 nodejs()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.js-plain-objects' version '%kotlinVersion%'
}

kotlin {
    js {
        browser() // 또는 nodejs()
    }
}
```

</tab>
</tabs>

## 일반 객체 타입 선언

`js-plain-objects` 플러그인을 활성화하면 일반 객체 타입을 선언할 수 있습니다.
외부 인터페이스에 `@JsPlainObject`로 어노테이션을 지정합니다. 예시:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    // 선택적 프로퍼티를 선언하려면 널러블 타입을 사용할 수 있습니다.
    val email: String? 
}
```

플러그인이 이러한 인터페이스를 처리하면 객체 생성 및 복사를 위한 두 개의 헬퍼 함수를 가진 컴패니언 객체를 생성합니다.

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    val email: String?

    // 플러그인에 의해 생성됨
    @JsExport.Ignore
    companion object {
        inline operator fun invoke(name: String, age: Int, email: String? = NOTHING): User =
            js("({ name: name, age: age, email: email })")

        inline fun copy(source: User, name: String = NOTHING, age: Int = NOTHING, email: String? = NOTHING): User =
            js("Object.assign({}, source, { name: name, age: age, email: email })")
    }
}
```

이전 예시에서:

*   `name`과 `age`는 널러블 마크 없이 선언되었으므로 필수입니다.
*   `email`은 널러블로 선언되었으므로 선택 사항이며 생성 시 건너뛸 수 있습니다.
*   연산자 `invoke`는 제공된 프로퍼티로 새로운 일반 JS 객체를 빌드합니다.
*   `copy` 함수는 `source`를 얕게 복사하고 지정된 모든 프로퍼티를 재정의하여 새 객체를 생성합니다.
*   이 헬퍼가 JS 내보내기로 유출되는 것을 방지하기 위해 컴패니언은 `@JsExport.Ignore`로 표시됩니다.

## 일반 객체 사용

생성된 헬퍼를 사용하여 객체를 생성하고 복사합니다:

```kotlin
fun main() {
    val user = User(name = "Name", age = 10)
    val copy = User.copy(user, age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

Kotlin 코드는 JavaScript로 컴파일됩니다:

```javascript
function main () {
    var user = { name: "Name", age: 10 };
    var copy = Object.assign({}, user, { age: 11, email: "some@user.com" });

    println(JSON.stringify(user));
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy));
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

이 접근 방식으로 생성된 모든 JavaScript 객체는 안전합니다.
잘못된 프로퍼티 이름이나 값 타입을 사용하면 컴파일 타임 오류가 발생합니다. 생성된 코드가 간단한 객체 리터럴 및 `Object.assign` 호출로 인라인되므로 이 접근 방식은 제로 코스트입니다.

## 다음 단계

[Kotlin에서 JavaScript 코드 사용](js-interop.md) 및 [동적 타입](dynamic-type.md) 문서에서 JavaScript와의 상호 운용성에 대해 자세히 알아보세요.