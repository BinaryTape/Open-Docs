[//]: # (title: GraalVM)

[//]: # (title: GraalVM)

<tldr>
<p>
<control>샘플 프로젝트</control>: <a href="https://github.com/ktorio/ktor-samples/tree/main/graalvm">graalvm</a>
</p>
</tldr>

<web-summary>
Ktor 서버 애플리케이션은 다양한 플랫폼을 위한 네이티브 이미지를 만들기 위해 GraalVM을 활용할 수 있습니다.
</web-summary>
<link-summary>
다양한 플랫폼에서 네이티브 이미지를 위해 GraalVM을 사용하는 방법을 알아보세요.
</link-summary>

Ktor 서버 애플리케이션은 다양한 플랫폼을 위한 네이티브 이미지를 만들기 위해 [GraalVM](https://graalvm.org)을 활용할 수 있으며, 물론 GraalVM이 제공하는 더 빠른 시작 시간과 기타 이점을 활용할 수 있습니다.

현재 GraalVM을 활용하려는 Ktor 서버 애플리케이션은 [애플리케이션 엔진](server-engines.md)으로 CIO를 사용해야 합니다.

## GraalVM 준비

GraalVM을 설치하고 설치 디렉터리를 시스템 경로에 추가하는 것 외에도, 모든 의존성이 번들되도록 애플리케이션을 준비해야 합니다. 즉, 팻 JAR를 생성해야 합니다.

### 리플렉션 구성

GraalVM은 리플렉션을 사용하는 애플리케이션과 관련하여 [일부 요구 사항](https://www.graalvm.org/22.1/reference-manual/native-image/Reflection/)을 가집니다. 이는 Ktor의 경우에도 마찬가지입니다. 특정 타입 정보를 포함하는 [JSON 파일](https://github.com/ktorio/ktor-samples/blob/main/graalvm/src/main/resources/META-INF/native-image/reflect-config.json)을 제공해야 합니다. 이 구성 파일은 그 후 `native-image` 도구에 인수로 전달됩니다.

## `native-image` 도구 실행

팻 JAR가 준비되면, 유일하게 필요한 단계는 `native-image` CLI 도구를 사용하여 네이티브 이미지를 생성하는 것입니다. 이는 [Gradle 플러그인](https://graalvm.github.io/native-build-tools/0.9.8/gradle-plugin.html)을 통해서도 수행될 수 있습니다. `build.gradle.kts` 파일의 예시는 [여기](https://github.com/ktorio/ktor-samples/blob/main/graalvm/build.gradle.kts)에서 볼 수 있습니다. 하지만 사용되는 의존성, 프로젝트의 패키지 이름 등에 따라 일부 옵션이 다를 수 있음에 유의하십시오.

## 결과 바이너리 실행

셸 스크립트가 오류 없이 실행되면 네이티브 애플리케이션을 얻게 되는데, 샘플의 경우 `graal-server`라고 불립니다. 이를 실행하면 Ktor 서버가 시작되고 `https://0.0.0.0:8080`에서 응답합니다.

[//]: # (<tldr>)

[//]: # (<var name="example_name" value="deployment-ktor-plugin"/>)

[//]: # (<p>
    <b>Code example</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>)

[//]: # (</tldr>)

[//]: # ()
[//]: # (<link-summary>)

[//]: # (Ktor server applications can make use of GraalVM in order to have native images for different platforms.)

[//]: # (</link-summary>)

[//]: # ()
[//]: # (Ktor server applications can make use of [GraalVM]&#40;https://graalvm.org&#41; in order to have native images for different platforms and, of course, take advantage of the faster start-up times and other benefits that GraalVM provides. The [Ktor Gradle plugin]&#40;https://github.com/ktorio/ktor-build-plugins&#41; allows you to build a project's GraalVM native image.)

[//]: # ()
[//]: # (> Currently, Ktor server applications that want to leverage GraalVM have to use CIO as the [application engine]&#40;Engines.md&#41;.)

[//]: # ()
[//]: # (## Prepare for GraalVM)

[//]: # ()
[//]: # (Before building a project's GraalVM native image, make sure the following prerequisites are met:)

[//]: # (- [GraalVM]&#40;https://www.graalvm.org/docs/getting-started/&#41; and [Native Image]&#40;https://www.graalvm.org/reference-manual/native-image/&#41; are installed.)

[//]: # (- The `GRAALVM_HOME` and `JAVA_HOME` environment variables are set.)

[//]: # ()
[//]: # (## Configure the Ktor plugin {id="configure-plugin"})

[//]: # (To build a native executable, you need to configure the Ktor plugin first:)

[//]: # (1. Open the `build.gradle.kts` file and add the plugin to the `plugins` block:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="5,8-9"})

[//]: # ()
[//]: # (2. Make sure the [main application class]&#40;server-dependencies.xml#create-entry-point&#41; is configured:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="11-13"})

[//]: # ()
[//]: # (3. Optionally, you can  configure the name of the native executable to be generated using the `ktor.nativeImage` extension:)

[//]: # (   ```kotlin)

[//]: # (   ```)

[//]: # (   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="29,48-51"})

[//]: # ()
[//]: # ()
[//]: # (## Build and run a native executable {id="build"})

[//]: # ()
[//]: # (The `buildNativeImage` task provided by the Ktor plugin generates a native executable with your application in the `build/native/nativeCompile` directory.)

[//]: # (Executing it will launch the Ktor server, responding on `https://0.0.0.0:8080` by default.)