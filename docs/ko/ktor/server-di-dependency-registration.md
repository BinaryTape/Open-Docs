[//]: # (title: 의존성 등록)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor의 [의존성 주입(DI)](server-dependency-injection.md) 컨테이너는 애플리케이션이 의존하는 객체를 생성하는 방법을 알아야 합니다. 이 과정을 의존성 등록(dependency registration)이라고 합니다.

### 기본 의존성 등록 {id="basic-registration"}

기본적인 의존성 등록은 코드 내에서 이루어지며, 일반적으로 `Application` 모듈 내의 `dependencies {}` 블록을 사용합니다.

[람다](#lambda-registration), [함수 참조](#function-reference), [클래스 참조](#class-reference) 또는 [생성자 참조](#constructor-reference)를 제공하여 의존성을 등록할 수 있습니다.

#### 람다 사용 {id="lambda-registration"}

인스턴스 생성 방식을 완전히 제어하고 싶을 때 람다를 사용합니다.

```kotlin
dependencies {
    provide<GreetingService> { GreetingServiceImpl() }
}
```
위 코드는 `GreetingService`에 대한 프로바이더(provider)를 등록합니다. `GreetingService`가 요청될 때마다 람다가 실행되어 인스턴스를 생성합니다.

#### 생성자 참조 사용 {id="constructor-reference"}

클래스를 생성자를 통해 만들 수 있고, 모든 생성자 파라미터가 이미 DI 컨테이너에 등록되어 있다면 생성자 참조를 사용할 수 있습니다.

```kotlin
dependencies {
    provide<GreetingService>(::GreetingServiceImpl)
}
```
이는 애플리케이션에 `GreetingServiceImpl`의 생성자를 사용하도록 지시하며, DI 컨테이너가 해당 파라미터들을 자동으로 해결(resolve)하도록 합니다.

#### 클래스 참조 사용 {id="class-reference"}

인터페이스에 바인딩하지 않고 구체 클래스(concrete class)를 직접 등록할 수 있습니다.

```kotlin
dependencies {
    provide(BankServiceImpl::class)
}
```
이 경우 의존성은 `BankServiceImpl` 타입에 의해 해결됩니다. 이는 구현 타입을 직접 주입하고 추상화가 필요하지 않은 경우에 유용합니다.

#### 함수 참조 사용 {id="function-reference"}

인스턴스를 생성하고 반환하는 함수를 등록할 수 있습니다.

```kotlin
dependencies {
    provide(::createBankTeller)
}
```

DI 컨테이너는 함수의 파라미터를 해결하고, 함수의 반환 값을 의존성 인스턴스로 사용합니다.

#### 팩토리 람다 사용 {id="factory-lambda-registration"}

함수 자체를 의존성으로 등록할 수 있습니다.

```kotlin
dependencies {
    provide<() -> GreetingService> {
        { GreetingServiceImpl() }
    }
}
```

이렇게 하면 주입받은 함수를 나중에 수동으로 호출하여 새로운 인스턴스를 생성할 수 있습니다.

### 명명된 의존성 등록 {id="named-registration"}

등록 시 의존성에 이름을 부여하여 동일한 타입의 여러 프로바이더를 구분할 수 있습니다.

이는 단일 타입에 대해 하나 이상의 구현체나 인스턴스를 등록해야 하고, 의존성 해결 시 이를 명시적으로 선택해야 할 때 유용합니다.

의존성에 이름을 할당하려면 `provide()` 함수의 첫 번째 인자로 이름을 전달합니다.

```kotlin
dependencies {
    provide("default") { GreetingServiceImpl() }
    provide("alternative") { AlternativeGreetingServiceImpl() }
}
```

명명된 의존성은 [`@Named` 어노테이션을 사용하여 명시적으로 해결](server-di-dependency-resolution.md#resolve-named)해야 합니다.

### 설정 기반 의존성 등록 {id="configuration-based-registration"}

설정 파일에서 클래스패스(classpath) 참조를 사용하여 선언적으로 의존성을 구성할 수 있습니다. 객체를 반환하는 함수나 생성자 해결이 가능한 클래스를 나열할 수 있습니다.

설정 파일의 `ktor.application.dependencies` 그룹 아래에 의존성을 나열합니다.

<Tabs>
<TabItem title="application.yaml">

```yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
```

</TabItem>
</Tabs>

Ktor는 DI 컨테이너를 사용하여 함수 및 생성자 파라미터를 자동으로 해결합니다.