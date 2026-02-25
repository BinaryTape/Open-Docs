[//]: # (title: JS plain objects 컴파일러 플러그인)

<primary-label ref="experimental-general"/>

JavaScript(JS) plain objects 컴파일러 플러그인(`js-plain-objects`)을 사용하면 타입 안전한 방식으로 일반 JS 객체를 생성하고 복사할 수 있습니다.

이 문서에서는 일반 JS 객체에 대한 정보와 Kotlin/JS 프로젝트에서 `js-plain-objects` 컴파일러 플러그인을 사용하는 방법을 확인할 수 있습니다.

> `js-plain-objects` 플러그인은 새로운 K2 Kotlin 컴파일러에서만 작동합니다.
>
{style="warning"}

## 일반 JS 객체 (Plain JS objects)

일반 객체(plain object)는 데이터 프로퍼티를 포함하며 객체 리터럴(`{}`)을 통해 생성된 단순한 JS 객체입니다.
많은 JS API가 설정이나 데이터 교환을 위해 일반 JS 객체를 전달받거나 반환합니다.

`js-plain-objects` 플러그인을 사용하면 Kotlin external 인터페이스를 선언하여 객체의 형태(shape)를 기술하고 여기에 `@JsPlainObject` 어노테이션을 추가할 수 있습니다. 그러면 컴파일러가 Kotlin의 타입 안전성을 유지하면서 이러한 객체를 생성하고 복사할 수 있는 편리한 함수들을 생성합니다.

## 플러그인 활성화

다음 Kotlin DSL 예시와 같이 프로젝트의 Gradle 설정 파일에 `js-plain-objects` 플러그인을 추가하세요.

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

`js-plain-objects` 플러그인을 활성화했다면, 일반 객체 타입을 선언할 수 있습니다.
external 인터페이스에 `@JsPlainObject` 어노테이션을 추가하세요. 예를 들면 다음과 같습니다.

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    // 프로퍼티를 선택 사항(optional)으로 선언하려면 널 허용(nullable) 타입을 사용하세요.
    val email: String? 
}
```

플러그인이 이러한 인터페이스를 처리할 때, 객체 생성 및 복사를 위한 두 개의 헬퍼 함수가 포함된 컴패니언 객체(companion object)를 생성합니다.

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

위 예시의 특징은 다음과 같습니다.

* `name`과 `age`는 널 허용 표시 없이 선언되었으므로 필수(required) 항목입니다.
* `email`은 널 허용으로 선언되었으므로 선택 사항(optional)이며 생성 시 생략할 수 있습니다.
* `invoke` 연산자는 제공된 프로퍼티들로 새로운 일반 JS 객체를 빌드합니다.
* `copy` 함수는 `source`를 얕은 복사(shallow-copying)하고 지정된 프로퍼티를 덮어씌워 새 객체를 생성합니다.
* 컴패니언 객체는 이러한 헬퍼들이 JS export로 노출되는 것을 방지하기 위해 `@JsExport.Ignore`가 지정됩니다.

## 일반 객체 사용

생성된 헬퍼를 사용하여 객체를 생성하고 복사합니다.

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

이 Kotlin 코드는 다음과 같은 JavaScript로 컴파일됩니다.

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

이러한 방식으로 생성된 모든 JavaScript 객체는 안전합니다. 잘못된 프로퍼티 이름이나 값 타입을 사용하면 컴파일 타임 에러가 발생합니다. 또한 생성된 코드가 단순한 객체 리터럴과 `Object.assign` 호출로 인라인화되므로 제로 비용(zero-cost) 방식입니다.

## 다음 단계

[Kotlin에서 JavaScript 코드 사용](js-interop.md) 및 [dynamic 타입](dynamic-type.md) 문서를 통해 JavaScript와의 상호 운용성에 대해 자세히 알아보세요.