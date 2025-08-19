import{_ as k,C as a,c as r,o as E,ag as p,G as s,w as n}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"导航与路由","description":"","frontmatter":{},"headers":[],"relativePath":"kmp/compose-navigation-routing.md","filePath":"kmp/compose-navigation-routing.md","lastUpdated":1755516278000}'),d={name:"kmp/compose-navigation-routing.md"};function o(g,i,c,y,F,m){const e=a("secondary-label"),l=a("code-block"),t=a("TabItem"),h=a("Tabs");return E(),r("div",null,[i[0]||(i[0]=p("",13)),s(e,{ref:"Experimental"},null,512),i[1]||(i[1]=p("",18)),s(h,null,{default:n(()=>[s(t,{title:"Kotlin/Wasm"},{default:n(()=>[s(l,{lang:"Kotlin",code:`        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            val body = document.body ?: return
            ComposeViewport(body) {
                App(
                    onNavHostReady = { navController ->
                        // 访问当前 URL 的片段子字符串
                        val initRoute = window.location.hash.substringAfter('#', "")
                        when {
                            // 识别对应的路由并导航到它
                            initRoute.startsWith("start") -> {
                                navController.navigate(StartScreen)
                            }
                            initRoute.startsWith("find_id") -> {
                                // 在导航到路由之前解析字符串以提取路由参数
                                val id = initRoute.substringAfter("find_id_").toLong()
                                navController.navigate(Id(id))
                            }
                            initRoute.startsWith("patient") -> {
                                val name = initRoute.substringAfter("patient_").substringBefore("_")
                                val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                navController.navigate(Patient(name, id))
                            }
                        }
                        window.bindToNavigation(navController) { ... }
                    }
                )
            }
        }`})]),_:1}),s(t,{title:"Kotlin/JS"},{default:n(()=>[s(l,{lang:"kotlin",code:`        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            onWasmReady {
                val body = document.body ?: return@onWasmReady
                ComposeViewport(body) {
                    App(
                        onNavHostReady = { navController ->
                            // 访问当前 URL 的片段子字符串
                            val initRoute = window.location.hash.substringAfter('#', "")
                            when {
                                // 识别对应的路由并导航到它
                                initRoute.startsWith("start") -> {
                                    navController.navigate(StartScreen)
                                }
                                initRoute.startsWith("find_id") -> {
                                    // 在导航到路由之前解析字符串以提取路由参数
                                    val id = initRoute.substringAfter("find_id_").toLong()
                                    navController.navigate(Id(id))
                                }
                                initRoute.startsWith("patient") -> {
                                    val name = initRoute.substringAfter("patient_").substringBefore("_")
                                    val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                    navController.navigate(Patient(name, id))
                                }
                            }
                            window.bindToNavigation(navController) { ... }
                        }
                    )
                }
            }
        }`})]),_:1})]),_:1})])}const A=k(d,[["render",o]]);export{C as __pageData,A as default};
