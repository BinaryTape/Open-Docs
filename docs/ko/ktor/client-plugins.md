[//]: # (title: 클라이언트 플러그인)

<link-summary>
로깅, 직렬화, 권한 부여 등과 같은 일반적인 기능을 제공하는 플러그인에 대해 알아봅니다.
</link-summary>

많은 애플리케이션에서 애플리케이션 로직 범위를 벗어나는 공통 기능이 필요합니다. 예를 들어 [로깅](client-logging.md), [직렬화](client-serialization.md), [권한 부여](client-auth.md)와 같은 기능들이 해당됩니다. 이 모든 기능은 Ktor에서 **플러그인**이라는 형태로 제공됩니다.

## 플러그인 의존성 추가 {id="plugin-dependency"}
플러그인은 별도의 [의존성](client-dependencies.md)을 필요로 할 수 있습니다. 예를 들어, [로깅](client-logging.md) 플러그인은 빌드 스크립트에 `ktor-client-logging` 아티팩트를 추가해야 합니다.

<var name="artifact_name" value="ktor-client-logging"/>

    <tabs group="languages">
        <tab title="Gradle (코틀린)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (그루비)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

필요한 의존성은 해당 플러그인에 대한 토픽에서 확인할 수 있습니다.

## 플러그인 설치 {id="install"}
플러그인을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 플러그인을 전달해야 합니다. 예를 들어, `Logging` 플러그인을 설치하는 방법은 다음과 같습니다:

[object Promise]

## 플러그인 구성 {id="configure_plugin"}
`install` 블록 내에서 플러그인을 구성할 수 있습니다. 예를 들어, [로깅](client-logging.md) 플러그인의 경우 로거, 로깅 레벨 및 로그 메시지를 필터링하는 조건을 지정할 수 있습니다:
[object Promise]

## 사용자 지정 플러그인 생성 {id="custom"}
사용자 지정 플러그인을 생성하는 방법은 [](client-custom-plugins.md)를 참조하세요.