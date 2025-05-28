[//]: # (title: BOM 제거)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
BOMRemover 플러그인을 사용하면 응답 본문에서 바이트 순서 마크(BOM)를 제거할 수 있습니다.
</link-summary>

[바이트 순서 마크(BOM)](https://en.wikipedia.org/wiki/Byte_order_mark)는 유니코드 파일 또는 스트림으로 인코딩된 문자입니다. BOM의 주요 목적은 텍스트의 스트림 인코딩과 16비트 및 32비트 인코딩의 바이트 순서를 알리는 것입니다.

일부 경우, 응답 본문에서 BOM을 제거해야 합니다. 예를 들어, UTF-8 인코딩에서 BOM의 존재는 선택 사항이며, BOM을 처리하는 방법을 모르는 소프트웨어에서 읽을 때 문제를 일으킬 수 있습니다.

Ktor 클라이언트는 UTF-8, UTF-16 (BE), UTF-16 (LE), UTF-32 (BE) 및 UTF-32 (LE) 인코딩에서 응답 본문에서 BOM을 제거하는 [BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html) 플러그인을 제공합니다.

> BOM을 제거할 때 Ktor는 `Content-Length` 헤더를 변경하지 않으며, 이는 초기 응답의 길이를 유지합니다.
>
{style="note"}

## 종속성 추가 {id="add_dependencies"}

`BOMRemover`를 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## BOMRemover 설치 {id="install_plugin"}

`BOMRemover`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달합니다.

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}