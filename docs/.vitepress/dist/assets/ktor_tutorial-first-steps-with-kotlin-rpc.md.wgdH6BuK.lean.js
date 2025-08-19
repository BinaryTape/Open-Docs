import{_ as w,a as K,b}from"./chunks/tutorial_kotlin_rpc_run_client.ueSZ_fWO.js";import{_ as y}from"./chunks/intellij_idea_gutter_icon.CL2MDlAT.js";import{_ as I,C as u,c as D,o as j,G as i,w as o,j as t,a as l}from"./chunks/framework.Bksy39di.js";const F=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"ktor/tutorial-first-steps-with-kotlin-rpc.md","filePath":"ktor/tutorial-first-steps-with-kotlin-rpc.md","lastUpdated":1755457140000}'),A={name:"ktor/tutorial-first-steps-with-kotlin-rpc.md"};function B(O,n,T,E,L,M){const f=u("show-structure"),P=u("web-summary"),g=u("link-summary"),C=u("card-summary"),m=u("Links"),S=u("tldr"),s=u("chapter"),a=u("format"),k=u("list"),r=u("step"),z=u("control"),x=u("ui-path"),e=u("Path"),d=u("procedure"),p=u("code-block"),R=u("tip"),v=u("topic");return j(),D("div",null,[i(v,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"Kotlin RPC 入门",id:"tutorial-first-steps-with-kotlin-rpc"},{default:o(()=>[i(f,{for:"chapter",depth:"2"}),i(P,null,{default:o(()=>n[0]||(n[0]=[l(" 在这份全面的指南中，探索 RPC 的基本原理并深入比较 RPC 与 REST。了解如何使用 Kotlin RPC 创建你的第一个应用程序。 ")])),_:1}),i(g,null,{default:o(()=>n[1]||(n[1]=[l(" 了解如何使用 Kotlin RPC 和 Ktor 创建你的第一个应用程序。 ")])),_:1}),i(C,null,{default:o(()=>n[2]||(n[2]=[l(" 了解如何使用 Kotlin RPC 和 Ktor 创建你的第一个应用程序。 ")])),_:1}),i(S,null,{default:o(()=>[n[10]||(n[10]=t("p",null,[t("b",null,"代码示例"),l(": "),t("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/tutorial-kotlin-rpc-app"}," tutorial-kotlin-rpc-app ")],-1)),t("p",null,[n[4]||(n[4]=t("b",null,"使用的插件",-1)),n[5]||(n[5]=l(": ")),i(m,{href:"/ktor/server-routing",summary:"Routing is a core plugin for handling incoming requests in a server application."},{default:o(()=>n[3]||(n[3]=[l("Routing")])),_:1}),n[6]||(n[6]=l(", ")),n[7]||(n[7]=t("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1)),n[8]||(n[8]=l(", ")),n[9]||(n[9]=t("a",{href:"https://github.com/Kotlin/kotlinx-rpc"},"kotlinx.rpc",-1))])]),_:1}),n[159]||(n[159]=t("p",null,[l(" Kotlin RPC (Remote Procedure Call，远程过程调用) 是 Kotlin 生态系统激动人心的新增成员，它构建于稳固的基础之上，并基于 "),t("code",null,"kotlinx.rpc"),l(" 库运行。 ")],-1)),n[160]||(n[160]=t("p",null,[t("code",null,"kotlinx.rpc"),l(" 库使你能够仅使用常规的 Kotlin 语言构造，即可跨网络边界发起过程调用。因此，它提供了 REST 和 Google RPC (gRPC) 的替代方案。 ")],-1)),n[161]||(n[161]=t("p",null," 在本文中，我们将介绍 Kotlin RPC 的核心概念并构建一个简单的应用程序。你随后可以在你自己的项目中求值该库。 ",-1)),i(s,{title:"前提",id:"prerequisites"},{default:o(()=>n[11]||(n[11]=[t("p",null,[l(" 本教程假定你对 Kotlin 编程有基本理解。如果你是 Kotlin 新手，请考虑审阅一些"),t("a",{href:"https://kotlinlang.org/docs/getting-started.html"},"入门材料"),l("。 ")],-1),t("p",null,[l("为了获得最佳体验，我们建议使用 "),t("a",{href:"https://www.jetbrains.com/idea/download"},"IntelliJ IDEA Ultimate"),l(" 作为你的集成开发环境 (IDE)，因为它提供了全面的支持和工具，将提高你的生产力。 ")],-1)])),_:1}),i(s,{title:"什么是 RPC？",id:"what-is-rpc"},{default:o(()=>[i(s,{title:"本地过程调用与远程过程调用",id:"local-vs-remote"},{default:o(()=>n[12]||(n[12]=[t("p",null," 任何有编程经验的人都会熟悉过程调用的概念。这是任何编程语言中的基本概念。从技术上讲，这些是本地过程调用，因为它们始终发生在同一个程序中。 ",-1),t("p",null," 远程过程调用是指函数调用和参数通过某种方式在网络上传输，以便实现可以在单独的 VM/可执行文件内发生。返回值则沿相反路径传回发起调用的机器。 ",-1),t("p",null," 最简单的想法是，将发生调用的机器视为客户端，将实现驻留的机器视为服务器。然而，情况并非一定如此。RPC 调用可以双向发生，作为对等架构的一部分。但为了保持简单，我们假设采用客户端/服务器部署。 ",-1)])),_:1}),i(s,{title:"RPC 框架基础",id:"rpc-framework-fundamentals"},{default:o(()=>[n[22]||(n[22]=t("p",null," 任何 RPC 框架都必须提供某些基本要素。在传统 IT 基础设施中实现远程过程调用时，这些是必不可少的。术语可能不同，职责划分也可能不同，但每个 RPC 框架都必须提供： ",-1)),i(k,{type:"decimal"},{default:o(()=>[n[19]||(n[19]=t("li",null,[l(" 声明将远程调用的过程的方式。在面向对象编程中，接口是逻辑选择。这可以是当前语言提供的接口构造，也可以是某种语言中立标准，例如 "),t("a",{href:"https://webidl.spec.whatwg.org/"},"W3C 使用的 Web IDL"),l("。 ")],-1)),n[20]||(n[20]=t("li",null," 指定用于参数和返回值的类型的方式。同样，你可以使用语言中立标准。然而，在当前语言中标注标准数据类型声明可能更简单。 ",-1)),t("li",null,[n[14]||(n[14]=l(" 辅助类，称为 ")),i(a,{style:{}},{default:o(()=>n[13]||(n[13]=[l("客户端存根")])),_:1}),n[15]||(n[15]=l("，它们将用于将过程调用转换为可在网络上传输的格式，并解包生成的返回值。这些存根可以在编译期或在运行时动态创建。 "))]),t("li",null,[n[17]||(n[17]=l(" 底层 ")),i(a,{style:{}},{default:o(()=>n[16]||(n[16]=[l("RPC 运行时")])),_:1}),n[18]||(n[18]=l("，它管理辅助类并监督远程过程调用的生命周期。在服务器端，此运行时需要嵌入到某种服务器中，以便它能够持续处理请求。 "))]),n[21]||(n[21]=t("li",null," 需要选择（或定义）协议来表示被调用的过程、序列化发送的数据以及在网络上传输信息。过去，一些技术从头定义了新协议（CORBA 中的 IIOP），而另一些则专注于重用（SOAP 中的 HTTP POST）。 ",-1))]),_:1})]),_:1}),i(s,{title:"编组与序列化",id:"marshaling-vs-serialization"},{default:o(()=>[t("p",null,[n[25]||(n[25]=l(" 在 RPC 框架中，我们谈论 ")),i(a,{style:{}},{default:o(()=>n[23]||(n[23]=[l("编组")])),_:1}),n[26]||(n[26]=l(" 和 ")),i(a,{style:{}},{default:o(()=>n[24]||(n[24]=[l("解组")])),_:1}),n[27]||(n[27]=l("。这是打包和解包要在网络上传输的信息的过程。它可以被认为是序列化的超集。在编组中，我们序列化对象，但我们还需要打包有关被调用的过程和调用发生上下文的信息。 "))])]),_:1}),n[28]||(n[28]=t("p",null,[l(" 介绍了 RPC 的核心概念后，让我们通过构建一个示例应用程序来了解它们如何在 "),t("code",null,"kotlinx.rpc"),l(" 中应用。 ")],-1))]),_:1}),i(s,{title:"你好，kotlinx.rpc",id:"hello-kotlinx-rpc"},{default:o(()=>[n[129]||(n[129]=t("p",null," 让我们创建一个通过网络订购披萨的应用程序。为了使代码尽可能简单，我们将使用基于控制台的客户端。 ",-1)),i(s,{title:"创建项目",id:"create-project"},{default:o(()=>[n[45]||(n[45]=t("p",null,"首先，你将创建一个包含客户端和服务器实现的项目。",-1)),n[46]||(n[46]=t("p",null," 在更复杂的应用程序中，最佳实践是为客户端和服务器使用独立模块。然而，为了本教程的简单起见，我们将为两者使用一个单一模块。 ",-1)),i(d,{id:"create-project-procedure"},{default:o(()=>[i(r,null,{default:o(()=>n[29]||(n[29]=[l(" 启动 "),t("a",{href:"https://www.jetbrains.com/idea/download/"},"IntelliJ IDEA",-1),l("。 ")])),_:1}),i(r,null,{default:o(()=>[t("p",null,[n[31]||(n[31]=l(" 在欢迎屏幕上，点击 ")),i(z,null,{default:o(()=>n[30]||(n[30]=[l("New Project")])),_:1}),n[32]||(n[32]=l("。 "))]),t("p",null,[n[34]||(n[34]=l(" 或者，从主菜单中选择 ")),i(x,null,{default:o(()=>n[33]||(n[33]=[l("File | New | Project")])),_:1}),n[35]||(n[35]=l("。 "))])]),_:1}),i(r,null,{default:o(()=>[n[38]||(n[38]=l(" 在 ")),i(z,null,{default:o(()=>n[36]||(n[36]=[l("Name")])),_:1}),n[39]||(n[39]=l(" 字段中，输入 ")),i(e,null,{default:o(()=>n[37]||(n[37]=[l("KotlinRpcPizzaApp")])),_:1}),n[40]||(n[40]=l(" 作为你项目的名称。 ")),n[41]||(n[41]=t("img",{src:w,alt:"IntelliJ New Kotlin Project window",style:{},width:"706","border-effect":"rounded"},null,-1))]),_:1}),i(r,null,{default:o(()=>[n[43]||(n[43]=l(" 保留其余默认设置，然后点击 ")),i(z,null,{default:o(()=>n[42]||(n[42]=[l("Create")])),_:1}),n[44]||(n[44]=l("。 "))]),_:1})]),_:1}),n[47]||(n[47]=t("p",null," 通常，你会立即配置项目构建文件。然而，那是一个不会提高你对技术理解的实现细节，所以我们最后再回到那一步。 ",-1))]),_:1}),i(s,{title:"添加共享类型",id:"shared-types"},{default:o(()=>[n[60]||(n[60]=t("p",null," 任何 RPC 项目的核心都是定义远程调用过程的接口，以及这些过程定义中使用的类型。 ",-1)),n[61]||(n[61]=t("p",null," 在多模块项目中，这些类型需要共享。然而，在此示例中，此步骤不是必需的。 ",-1)),i(d,{id:"shared-types-procedure"},{default:o(()=>[i(r,null,{default:o(()=>[n[50]||(n[50]=l(" 导航到 ")),i(e,null,{default:o(()=>n[48]||(n[48]=[l("src/main/kotlin")])),_:1}),n[51]||(n[51]=l(" 文件夹并创建一个名为 ")),i(e,null,{default:o(()=>n[49]||(n[49]=[l("model")])),_:1}),n[52]||(n[52]=l(" 的新子包。 "))]),_:1}),i(r,null,{default:o(()=>[n[55]||(n[55]=l(" 在 ")),i(e,null,{default:o(()=>n[53]||(n[53]=[l("model")])),_:1}),n[56]||(n[56]=l(" 包内，创建一个新的 ")),i(e,null,{default:o(()=>n[54]||(n[54]=[l("PizzaShop.kt")])),_:1}),n[57]||(n[57]=l(" 文件，其实现如下： ")),i(p,{lang:"kotlin",code:`package com.example.model

import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable
import kotlinx.rpc.annotations.Rpc

@Rpc
interface PizzaShop {
    suspend fun orderPizza(pizza: Pizza): Receipt
}

@Serializable
class Pizza(val name: String)

@Serializable
class Receipt(val amount: Double)`}),n[58]||(n[58]=t("p",null,[l(" 该接口需要包含来自 "),t("code",null,"kotlinx.rpc"),l(" 库的 "),t("code",null,"@Rpc"),l(" 注解。 ")],-1)),n[59]||(n[59]=t("p",null,[l(" 因为你正在使用 "),t("a",{href:"https://github.com/Kotlin/kotlinx.serialization"},[t("code",null,"kotlinx.serialization")]),l(" 来帮助在网络上传输信息，所以参数中使用的类型必须标记有 "),t("code",null,"Serializable"),l(" 注解。 ")],-1))]),_:1})]),_:1})]),_:1}),i(s,{title:"实现客户端",id:"client-implementation"},{default:o(()=>[i(d,{id:"client-impl-procedure"},{default:o(()=>[i(r,null,{default:o(()=>[n[64]||(n[64]=l(" 导航到 ")),i(e,null,{default:o(()=>n[62]||(n[62]=[l("src/main/kotlin")])),_:1}),n[65]||(n[65]=l(" 并创建一个新的 ")),i(e,null,{default:o(()=>n[63]||(n[63]=[l("Client.kt")])),_:1}),n[66]||(n[66]=l(" 文件。 "))]),_:1}),i(r,null,{default:o(()=>[n[68]||(n[68]=l(" 打开 ")),i(e,null,{default:o(()=>n[67]||(n[67]=[l("Client.kt")])),_:1}),n[69]||(n[69]=l(" 并添加以下实现： ")),i(p,{lang:"kotlin",code:`package com.example

import com.example.model.Pizza
import com.example.model.PizzaShop
import io.ktor.client.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlinx.rpc.withService
import kotlinx.rpc.krpc.serialization.json.json
import kotlinx.rpc.krpc.ktor.client.KtorRpcClient
import kotlinx.rpc.krpc.ktor.client.installKrpc
import kotlinx.rpc.krpc.ktor.client.rpc
import kotlinx.rpc.krpc.ktor.client.rpcConfig

fun main() = runBlocking {
    val ktorClient = HttpClient {
        installKrpc {
            waitForServices = true
        }
    }

    val client: KtorRpcClient = ktorClient.rpc {
        url {
            host = "localhost"
            port = 8080
            encodedPath = "pizza"
        }

        rpcConfig {
            serialization {
                json()
            }
        }
    }

    val pizzaShop: PizzaShop = client.withService<PizzaShop>()

    val receipt = pizzaShop.orderPizza(Pizza("Pepperoni"))
    println("Your pizza cost \${receipt.amount}")
    ktorClient.close()
}`})]),_:1})]),_:1}),n[84]||(n[84]=t("p",null," 你只需要 25 行代码即可为执行 RPC 调用做准备并实际执行。显然，这其中发生了很多事情，所以让我们将代码分解成几个部分。 ",-1)),t("p",null,[n[71]||(n[71]=t("code",null,"kotlinx.rpc",-1)),n[72]||(n[72]=l(" 库使用 ")),i(m,{href:"/ktor/client-create-new-application",summary:"Create your first client application for sending a request and receiving a response."},{default:o(()=>n[70]||(n[70]=[l("Ktor 客户端")])),_:1}),n[73]||(n[73]=l(" 来在客户端托管其运行时。该运行时不与 Ktor 耦合，也可以选择其他方案，但这促进了重用，并使得 ")),n[74]||(n[74]=t("code",null,"kotlinx.rpc",-1)),n[75]||(n[75]=l(" 易于集成到现有 KMP 应用程序中。 "))]),n[85]||(n[85]=t("p",null,[l(" Ktor 客户端和 Kotlin RPC 都基于协程构建，因此你使用 "),t("code",null,"runBlocking"),l(" 来创建初始协程，并在其中执行客户端的其余部分： ")],-1)),i(p,{lang:"kotlin",code:`fun main() = runBlocking {
}`}),i(R,null,{default:o(()=>n[76]||(n[76]=[l(" 请注意，"),t("code",null,"runBlocking",-1),l(" 专为快速原型和测试设计，而非生产代码。 ")])),_:1}),t("p",null,[n[78]||(n[78]=l(" 接下来，你以标准方式创建 Ktor 客户端实例。")),n[79]||(n[79]=t("code",null,"kotlinx.rpc",-1)),n[80]||(n[80]=l(" 在底层使用 ")),i(m,{href:"/ktor/client-websockets",summary:"The Websockets plugin allows you to create a multi-way communication session between a server and a client."},{default:o(()=>n[77]||(n[77]=[l("WebSockets")])),_:1}),n[81]||(n[81]=l(" 插件来传输信息。你只需要通过使用 ")),n[82]||(n[82]=t("code",null,"installKrpc()",-1)),n[83]||(n[83]=l(" 函数确保其被加载： "))]),i(p,{lang:"kotlin",code:`    val ktorClient = HttpClient {
        installKrpc {
            waitForServices = true
        }
    }`}),n[86]||(n[86]=t("p",null,[l(" 创建此 Ktor 客户端后，你将创建一个 "),t("code",null,"KtorRpcClient"),l(" 对象来调用远程过程。你需要配置服务器的位置以及用于传输信息的机制： ")],-1)),i(p,{lang:"kotlin",code:`    val client: KtorRpcClient = ktorClient.rpc {
        url {
            host = "localhost"
            port = 8080
            encodedPath = "pizza"
        }

        rpcConfig {
            serialization {
                json()
            }
        }
    }`}),n[87]||(n[87]=t("p",null,[l(" 至此，标准设置已完成，你已准备好使用问题域特有的功能。你可以使用客户端创建一个实现 "),t("code",null,"PizzaShop"),l(" 接口方法的客户端代理对象： ")],-1)),i(p,{lang:"kotlin","include-symbol":"pizzaShop",code:`package com.example

import com.example.model.Pizza
import com.example.model.PizzaShop
import io.ktor.client.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import kotlinx.rpc.withService
import kotlinx.rpc.krpc.serialization.json.json
import kotlinx.rpc.krpc.ktor.client.KtorRpcClient
import kotlinx.rpc.krpc.ktor.client.installKrpc
import kotlinx.rpc.krpc.ktor.client.rpc
import kotlinx.rpc.krpc.ktor.client.rpcConfig

fun main() = runBlocking {
    val ktorClient = HttpClient {
        installKrpc {
            waitForServices = true
        }
    }

    val client: KtorRpcClient = ktorClient.rpc {
        url {
            host = "localhost"
            port = 8080
            encodedPath = "pizza"
        }

        rpcConfig {
            serialization {
                json()
            }
        }
    }

    val pizzaShop: PizzaShop = client.withService<PizzaShop>()

    /*
    val receipt = pizzaShop.orderPizza(Pizza("Pepperoni"))
    println("Your pizza cost \${receipt.amount}")
    */

    pizzaShop.orderPizza("AB12", Pizza("Pepperoni"))
    pizzaShop.orderPizza("AB12", Pizza("Hawaiian"))
    pizzaShop.orderPizza("AB12", Pizza("Calzone"))

    pizzaShop.orderPizza("CD34", Pizza("Margherita"))
    pizzaShop.orderPizza("CD34", Pizza("Sicilian"))
    pizzaShop.orderPizza("CD34", Pizza("California"))

    pizzaShop.viewOrders("AB12").collect {
        println("AB12 ordered \${it.name}")
    }

    pizzaShop.viewOrders("CD34").collect {
        println("CD34 ordered \${it.name}")
    }

    ktorClient.close()
}`}),n[88]||(n[88]=t("p",null," 然后你可以发起远程过程调用并使用结果： ",-1)),i(p,{lang:"kotlin",code:'    val receipt = pizzaShop.orderPizza(Pizza("Pepperoni"))\n    println("Your pizza cost ${receipt.amount}")'}),n[89]||(n[89]=t("p",null," 请注意，在这一点上为你完成了大量工作。调用的细节和所有参数都必须转换为消息，通过网络发送，然后接收并解码返回值。这种透明的发生方式是初始设置的回报。 ",-1)),n[90]||(n[90]=t("p",null," 最后，我们需要像往常一样关闭客户端： ",-1)),i(p,{lang:"kotlin",code:"    ktorClient.close()"})]),_:1}),i(s,{title:"实现服务器",id:"server-implementation"},{default:o(()=>[n[107]||(n[107]=t("p",null," 服务器端的实现分为两部分。首先，你需要创建我们接口的一个实现；其次，你需要将其托管在服务器中。 ",-1)),i(d,{id:"create-interface"},{default:o(()=>[i(r,null,{default:o(()=>[n[93]||(n[93]=l(" 导航到 ")),i(e,null,{default:o(()=>n[91]||(n[91]=[l("src/main/kotlin")])),_:1}),n[94]||(n[94]=l(" 并创建一个新的 ")),i(e,null,{default:o(()=>n[92]||(n[92]=[l("Server.kt")])),_:1}),n[95]||(n[95]=l(" 文件。 "))]),_:1}),i(r,null,{default:o(()=>[n[97]||(n[97]=l(" 打开 ")),i(e,null,{default:o(()=>n[96]||(n[96]=[l("Server.kt")])),_:1}),n[98]||(n[98]=l(" 并添加以下实现： ")),i(p,{lang:"kotlin",code:`package com.example

import com.example.model.*
import io.ktor.server.application.*

class PizzaShopImpl : PizzaShop {
    override suspend fun orderPizza(pizza: Pizza): Receipt {
        return Receipt(7.89)
    }
}`}),n[99]||(n[99]=t("p",null," 显然，这不是一个真实世界的实现，但它足以让我们的演示运行起来。 ",-1)),n[100]||(n[100]=t("p",null," 实现的第二部分基于 Ktor 构建。 ",-1))]),_:1}),i(r,null,{default:o(()=>[n[101]||(n[101]=t("p",null," 将以下代码添加到同一个文件中： ",-1)),i(p,{lang:"kotlin",code:`fun main() {
    embeddedServer(Netty, port = 8080) {
        module()
        println("Server running")
    }.start(wait = true)
}

fun Application.module() {
    install(Krpc)

    routing {
        rpc("/pizza") {
            rpcConfig {
                serialization {
                    json()
                }
            }

            registerService<PizzaShop> { PizzaShopImpl() }
        }
    }
}`}),n[102]||(n[102]=t("p",null,"以下是详细说明：",-1)),n[103]||(n[103]=t("p",null," 首先，你创建 Ktor/Netty 实例，并使用指定的扩展函数进行配置： ",-1)),i(p,{lang:"kotlin",code:`    embeddedServer(Netty, port = 8080) {
        module()
        println("Server running")
    }.start(wait = true)`}),n[104]||(n[104]=t("p",null,[l(" 然后，你声明一个扩展 Ktor Application 类型的设置函数。此函数安装 "),t("code",null,"kotlinx.rpc"),l(" 插件并声明一个或多个路由： ")],-1)),i(p,{lang:"kotlin",code:`fun Application.module() {
    install(Krpc)

    routing {
    }
}`}),n[105]||(n[105]=t("p",null,[l(" 在路由部分中，你使用 "),t("code",null,"kotlinx.rpc"),l(" 对 Ktor Routing DSL 的扩展来声明一个端点。与客户端一样，你指定 URL 并配置序列化。但在此情况下，我们的实现将监听该 URL 以处理传入请求： ")],-1)),i(p,{lang:"kotlin",code:`        rpc("/pizza") {
            rpcConfig {
                serialization {
                    json()
                }
            }

            registerService<PizzaShop> { PizzaShopImpl() }
        }`}),n[106]||(n[106]=t("p",null,[l(" 请注意，你使用 "),t("code",null,"registerService"),l(" 将接口的实现提供给 RPC 运行时。你可能希望有多个实例，但这是后续文章的主题。 ")],-1))]),_:1})]),_:1})]),_:1}),i(s,{title:"添加依赖项",id:"add-dependencies"},{default:o(()=>[n[116]||(n[116]=t("p",null,[l(" 你现在已经拥有运行应用程序所需的所有代码，但目前它甚至无法编译，更不用说执行了。 你可以使用 Ktor 项目生成器配合 "),t("a",{href:"https://start.ktor.io/p/kotlinx-rpc"},"kotlinx.rpc"),l(" 插件， 或者你可以手动配置构建文件。这也不是太复杂。 ")],-1)),i(d,{id:"configure-build-files"},{default:o(()=>[i(r,null,{default:o(()=>[n[110]||(n[110]=l(" 在 ")),i(e,null,{default:o(()=>n[108]||(n[108]=[l("build.gradle.kts")])),_:1}),n[111]||(n[111]=l(" 文件中，添加以下插件： ")),i(p,{lang:"kotlin",code:`plugins {
    kotlin("jvm") version "2.2.0"
    kotlin("plugin.serialization") version "2.2.0"
    id("io.ktor.plugin") version "3.2.0"
    id("org.jetbrains.kotlinx.rpc.plugin") version "0.9.1"
}`}),n[112]||(n[112]=t("p",null," Kotlin 插件的原因显而易见。至于其他插件，解释如下： ",-1)),i(k,null,{default:o(()=>n[109]||(n[109]=[t("li",null,[l(" 需要 "),t("code",null,"kotlinx.serialization"),l(" 插件来生成辅助类型，以便将 Kotlin 对象转换为 JSON。请记住，"),t("code",null,"kotlinx.serialization"),l(" 不使用反射。 ")],-1),t("li",null," Ktor 插件用于构建将应用程序及其所有依赖项打包在一起的胖 JAR。 ",-1),t("li",null," 需要 RPC 插件来生成客户端的存根。 ",-1)])),_:1})]),_:1}),i(r,null,{default:o(()=>[n[113]||(n[113]=l(" 添加以下依赖项： ")),i(p,{lang:"kotlin",code:`    implementation("io.ktor:ktor-client-cio-jvm")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-client:0.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-client:0.9.1")
    implementation("io.ktor:ktor-server-netty-jvm")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-server:0.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-ktor-server:0.9.1")
    implementation("org.jetbrains.kotlinx:kotlinx-rpc-krpc-serialization-json:0.9.1")
    implementation("ch.qos.logback:logback-classic:1.5.18")
    testImplementation(kotlin("test"))
}`}),n[114]||(n[114]=t("p",null,[l(" 这添加了 Ktor 客户端和服务器，"),t("code",null,"kotlinx.rpc"),l(" 运行时的客户端和服务器部分，以及用于集成 "),t("code",null,"kotlinx.rpc"),l(" 和 "),t("code",null,"kotlinx-serialization"),l(" 的库。 ")],-1)),n[115]||(n[115]=t("p",null," 有了这些，你现在就可以运行项目并开始发起 RPC 调用了。 ",-1))]),_:1})]),_:1})]),_:1}),i(s,{title:"运行应用程序",id:"run-application"},{default:o(()=>[n[128]||(n[128]=t("p",null," 要运行演示，请按照以下步骤操作： ",-1)),i(d,{id:"run-app-procedure"},{default:o(()=>[i(r,null,{default:o(()=>[n[118]||(n[118]=l(" 导航到 ")),i(e,null,{default:o(()=>n[117]||(n[117]=[l("Server.kt")])),_:1}),n[119]||(n[119]=l(" 文件。 "))]),_:1}),i(r,null,{default:o(()=>[n[123]||(n[123]=t("p",null,[l("在 IntelliJ IDEA 中，点击 "),t("code",null,"main()"),l(" 函数旁边的运行按钮 ("),t("img",{src:y,style:{},height:"16",width:"16",alt:"intelliJ IDEA run icon"}),l(") 以启动应用程序。")],-1)),t("p",null,[n[121]||(n[121]=l(" 你应该在 ")),i(z,null,{default:o(()=>n[120]||(n[120]=[l("Run")])),_:1}),n[122]||(n[122]=l(" 工具面板中看到以下输出： "))]),n[124]||(n[124]=t("img",{src:K,alt:"Run server output in intelliJ IDEA",style:{},width:"706","border-effect":"line"},null,-1))]),_:1}),i(r,null,{default:o(()=>[n[126]||(n[126]=l(" 导航到 ")),i(e,null,{default:o(()=>n[125]||(n[125]=[l("Client.kt")])),_:1}),n[127]||(n[127]=l(" 文件并运行应用程序。你应该在控制台中看到以下输出： ")),i(p,{lang:"shell",code:`                        Your pizza cost 7.89

                        Process finished with exit code 0`})]),_:1})]),_:1})]),_:1})]),_:1}),i(s,{title:"扩展示例",id:"extend-the-example"},{default:o(()=>[n[151]||(n[151]=t("p",null," 最后，让我们增加示例应用程序的复杂性，为未来的开发打下坚实基础。 ",-1)),i(d,{id:"extend-server"},{default:o(()=>[i(r,null,{default:o(()=>[n[131]||(n[131]=l(" 在 ")),i(e,null,{default:o(()=>n[130]||(n[130]=[l("PizzaShop.kt")])),_:1}),n[132]||(n[132]=l(" 文件中，通过包含客户端 ID 来扩展 ")),n[133]||(n[133]=t("code",null,"orderPizza",-1)),n[134]||(n[134]=l(" 方法，并添加一个 ")),n[135]||(n[135]=t("code",null,"viewOrders",-1)),n[136]||(n[136]=l(" 方法，该方法返回指定客户端的所有待处理订单： ")),i(p,{lang:"kotlin",code:`package com.example.model

import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.Serializable
import kotlinx.rpc.annotations.Rpc

@Rpc
interface PizzaShop {
    suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt
    fun viewOrders(clientID: String): Flow<Pizza>
}`}),n[137]||(n[137]=t("p",null,[l(" 你可以通过返回一个 "),t("code",null,"Flow"),l(" 而不是 "),t("code",null,"List"),l(" 或 "),t("code",null,"Set"),l(" 来利用协程库。这将允许你一次一片地将信息流式传输到客户端。 ")],-1))]),_:1}),i(r,null,{default:o(()=>[n[139]||(n[139]=l(" 导航到 ")),i(e,null,{default:o(()=>n[138]||(n[138]=[l("Server.kt")])),_:1}),n[140]||(n[140]=l(" 文件，并通过将当前订单存储在 ")),n[141]||(n[141]=t("code",null,"map",-1)),n[142]||(n[142]=l(" of ")),n[143]||(n[143]=t("code",null,"list",-1)),n[144]||(n[144]=l(" 中来实现此功能： ")),i(p,{lang:"kotlin",code:`class PizzaShopImpl : PizzaShop {
    private val openOrders = mutableMapOf<String, MutableList<Pizza>>()

    override suspend fun orderPizza(clientID: String, pizza: Pizza): Receipt {
        if(openOrders.containsKey(clientID)) {
            openOrders[clientID]?.add(pizza)
        } else {
            openOrders[clientID] = mutableListOf(pizza)
        }
        return Receipt(3.45)
    }

    override fun viewOrders(clientID: String): Flow<Pizza> {
        val orders = openOrders[clientID]
        if (orders != null) {
            return flow {
                for (order in orders) {
                    emit(order)
                    delay(1000)
                }
            }
        }
        return flow {}
    }
}`}),n[145]||(n[145]=t("p",null,[l(" 请注意，每个客户端实例都会创建一个新的 "),t("code",null,"PizzaShopImpl"),l(" 实例。这通过隔离它们的状态来避免客户端之间的冲突。但是，它不解决单个服务器实例内的线程安全问题，特别是当多个服务并发访问同一实例时。 ")],-1))]),_:1}),i(r,null,{default:o(()=>[n[147]||(n[147]=l(" 在 ")),i(e,null,{default:o(()=>n[146]||(n[146]=[l("Client.kt")])),_:1}),n[148]||(n[148]=l(" 文件中，使用两个不同的客户端 ID 提交多个订单： ")),i(p,{lang:"kotlin",code:`    val pizzaShop: PizzaShop = client.withService<PizzaShop>()

    pizzaShop.orderPizza("AB12", Pizza("Pepperoni"))
    pizzaShop.orderPizza("AB12", Pizza("Hawaiian"))
    pizzaShop.orderPizza("AB12", Pizza("Calzone"))

    pizzaShop.orderPizza("CD34", Pizza("Margherita"))
    pizzaShop.orderPizza("CD34", Pizza("Sicilian"))
    pizzaShop.orderPizza("CD34", Pizza("California"))`}),n[149]||(n[149]=t("p",null,[l(" 然后，你使用 Coroutines 库和 "),t("code",null,"collect"),l(" 方法迭代结果： ")],-1)),i(p,{lang:"kotlin",code:`    pizzaShop.viewOrders("AB12").collect {
        println("AB12 ordered \${it.name}")
    }

    pizzaShop.viewOrders("CD34").collect {
        println("CD34 ordered \${it.name}")
    }`})]),_:1}),i(r,null,{default:o(()=>n[150]||(n[150]=[l(" 运行服务器和客户端。当你运行客户端时，你将看到结果递增地显示： "),t("img",{src:b,alt:"Client output incrementally displaying results",style:{},width:"706","border-effect":"line"},null,-1)])),_:1})]),_:1}),n[152]||(n[152]=t("p",null," 创建了一个工作示例后，现在让我们深入探讨一切是如何运作的。特别是，让我们比较和对比 Kotlin RPC 与两个主要替代方案——REST 和 gRPC。 ",-1))]),_:1}),i(s,{title:"RPC 与 REST",id:"rpc-vs-rest"},{default:o(()=>[n[154]||(n[154]=t("p",null,[l(" RPC 的概念比 REST 早得多，"),t("a",{href:"https://en.wikipedia.org/wiki/Remote_procedure_call"},"至少可以追溯到 1981 年"),l("。与 REST 相比，基于 RPC 的方法不限制你使用统一接口（例如 HTTP 请求类型），在代码中更易于使用，并且由于二进制消息传递而具有更高的性能。 ")],-1)),n[155]||(n[155]=t("p",null," 然而，REST 有三个主要优势： ",-1)),i(k,{type:"decimal"},{default:o(()=>n[153]||(n[153]=[t("li",null," 它可以直接由浏览器中的 JavaScript 客户端使用，因此可以作为单页应用程序的一部分。由于 RPC 框架依赖于生成的存根和二进制消息传递，它们与 JavaScript 生态系统不太兼容。 ",-1),t("li",null,[l(" 当特性涉及网络时，REST 会使其显而易见。这有助于避免 Martin Fowler 指出的"),t("a",{href:"https://martinfowler.com/articles/distributed-objects-microservices.html"},"分布式对象反模式"),l("。当团队将其面向对象设计拆分为两个或多个部分，而未考虑将本地过程调用变为远程调用所带来的性能和可靠性影响时，就会发生这种情况。 ")],-1),t("li",null," REST API 基于一系列约定构建，这些约定使其相对容易创建、文档化、监控、调试和测试。有一个庞大的工具生态系统来支持这一点。 ",-1)])),_:1}),n[156]||(n[156]=t("p",null,[l(" 这些权衡意味着 Kotlin RPC 最适合在两种场景中使用。首先，是在使用 Compose Multiplatform 的 KMP 客户端中；其次，是在云中协作的微服务之间。Kotlin/Wasm 的未来发展可能会使 "),t("code",null,"kotlinx.rpc"),l(" 更适用于基于浏览器的应用程序。 ")],-1))]),_:1}),i(s,{title:"Kotlin RPC 与 Google RPC",id:"kotlin-rpc-vs-google-rpc"},{default:o(()=>n[157]||(n[157]=[t("p",null," Google RPC 是目前软件行业中主导的 RPC 技术。一种名为 Protocol Buffers (protobuf) 的标准用于使用语言中立的接口定义语言 (IDL) 定义数据结构和消息负载。这些 IDL 定义可以转换为各种编程语言，并使用紧凑高效的二进制格式进行序列化。Quarkus 和 Micronaut 等微服务框架已经支持 gRPC。 ",-1),t("p",null,[l(" Kotlin RPC 很难与 gRPC 竞争，这对 Kotlin 社区也没有益处。幸好，目前没有这方面的计划。相反，其意图是让 "),t("code",null,"kotlinx.rpc"),l(" 与 gRPC 兼容且可互操作。"),t("code",null,"kotlinx.rpc"),l(" 服务将能够使用 gRPC 作为其网络协议，而 "),t("code",null,"kotlinx.rpc"),l(" 客户端将能够调用 gRPC 服务。"),t("code",null,"kotlinx.rpc"),l(" 将使用其自己的 kRPC 协议作为默认选项（如我们当前示例所示），但没有什么能阻止你选择 gRPC。 ")],-1)])),_:1}),i(s,{title:"后续步骤",id:"next-steps"},{default:o(()=>n[158]||(n[158]=[t("p",null,[l(" Kotlin RPC 将 Kotlin 生态系统扩展到新方向，为创建和使用服务提供了 REST 和 GraphQL 的替代方案。它基于 Ktor、协程和 "),t("code",null,"kotlinx-serialization"),l(" 等成熟的库和框架构建。对于希望利用 Kotlin Multiplatform 和 Compose Multiplatform 的团队，它将为分布式消息传递提供一个简单高效的选项。 ")],-1),t("p",null,[l(" 如果本介绍激发了你的兴趣，请务必查看 "),t("a",{href:"https://kotlin.github.io/kotlinx-rpc/get-started.html"},[l("官方的 "),t("code",null,"kotlinx.rpc"),l(" 文档")]),l("和"),t("a",{href:"https://github.com/Kotlin/kotlinx-rpc/tree/main/samples"},"示例"),l("。 ")],-1),t("p",null,[t("code",null,"kotlinx.rpc"),l(" 库尚处于早期阶段，因此我们鼓励你探索它并分享你的反馈。错误和特性请求可以在 "),t("a",{href:"https://youtrack.jetbrains.com/issues/KRPC"},"YouTrack"),l(" 上找到，而一般性讨论则在 "),t("a",{href:"https://kotlinlang.slack.com/archives/C072YJ3Q91V"},"Slack"),l(" 上进行（"),t("a",{href:"https://surveys.jetbrains.com/s3/kotlin-slack-sign-up"},"请求访问"),l("）。 ")],-1)])),_:1})]),_:1})])}const H=I(A,[["render",B]]);export{F as __pageData,H as default};
