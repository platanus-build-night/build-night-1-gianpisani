'use client';

import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, BookOpen, Github, Star, CheckCircle, Download, FileCheck, Users, Plus, ChevronRight, Copy, Eye } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-24">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-900 tracking-tight mb-4 sm:mb-6">
                Formai<span className="text-emerald-500">.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto font-light px-4">
                Plataforma moderna para la generación y gestión de documentos legales dinámicos
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto px-4"
            >
              <Link href="/documents" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-slate-900 rounded-xl hover:bg-slate-800 text-white font-medium px-6 sm:px-8 py-4 sm:py-6 h-auto text-base sm:text-lg shadow-lg hover:shadow-xl transition-all">
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href="https://github.com/platanus-build-night/build-night-1-gianpisani"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 sm:py-6 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors text-base sm:text-lg font-medium shadow-sm hover:shadow-md"
              >
                <Github className="w-5 h-5" />
                Ver en GitHub
              </a>
            </motion.div>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-gradient-to-b from-slate-50 to-slate-100 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 text-slate-900 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium">Gestión Simplificada</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 mb-4 px-4">
              Todo en un solo lugar
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-light px-4">
              Administra tus documentos y trámites legales con una interfaz moderna y profesional
            </p>
          </div>

          <div className="relative px-4 sm:px-0">
            {/* Mock Browser Content */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
              {/* Browser Bar remains the same */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full max-w-sm mx-auto h-8 rounded-lg bg-white shadow-sm flex items-center px-3 border border-slate-200">
                    <FileText className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-400">formai.cl/documents</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-3 my-2">
                      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">Documentos<span className="text-emerald-500">.</span></h1>
                    </div>
                    <p className="text-slate-500 mt-2">Gestiona tus documentos y trámites legales</p>
                  </div>
                  <div className="bg-slate-900 text-white font-medium px-4 sm:px-6 py-2 h-11 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 justify-center">
                    <Plus className="w-5 h-5" />
                    <span>Crear Documento</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Document Cards */}
                  {[
                    {
                      name: "Contrato de Arrendamiento",
                      date: "Hace 4 horas",
                      steps: 3,
                      procedures: [
                        { client: "Juan Pérez", status: "completed" },
                        { client: "María García", status: "pending" }
                      ]
                    },
                    {
                      name: "Poder Notarial",
                      date: "Hace 2 días",
                      steps: 2,
                      procedures: [
                        { client: "Carlos López", status: "pending" }
                      ]
                    }
                  ].map((doc, index) => (
                    <motion.div
                      key={doc.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1) }}
                      className="hover:shadow-2xl p-4 hover:shadow-slate-500/5 transition-all duration-300 bg-white border border-slate-200 rounded-xl relative group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-slate-900 rounded-lg">
                            <FileText className="w-5 h-5 text-slate-100" />
                          </div>
                          <div className="text-lg font-medium text-slate-800 line-clamp-1 inline-flex items-center gap-2">
                            {doc.name} <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm text-slate-500 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                          <span>{doc.date}</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                          {doc.steps} paso{doc.steps === 1 ? '' : 's'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="w-full rounded-xl bg-slate-900 hover:bg-slate-700 border-slate-200 text-slate-50 flex items-center justify-center gap-2 py-3 group/button cursor-pointer">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5">
                              <Users className="w-4 h-4" />
                            </div>
                            <span className="font-medium">Iniciar Nuevo Trámite</span>
                          </div>
                        </div>

                        <div className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 text-slate-600 shrink-0" />
                              <span className="text-sm font-medium">Trámites en Curso</span>
                              <div className="flex items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  {doc.procedures.length}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                          </div>
                        </div>

                        <div className="mt-2 space-y-2">
                          {doc.procedures.map((procedure, i) => (
                            <motion.div
                              key={procedure.client}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.2,
                                delay: 0.8 + (i * 0.05),
                                ease: "easeOut"
                              }}
                              className="group/procedure hover:bg-slate-100 transition-all duration-200"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 rounded-lg gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className={`shrink-0 w-2 h-2 rounded-full ${
                                    procedure.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
                                  }`} />
                                  <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-slate-900 text-sm font-medium truncate">
                                        {procedure.client}
                                      </span>
                                      <span className={`text-xs font-medium ${
                                        procedure.status === 'completed' 
                                          ? 'text-emerald-700'
                                          : 'text-amber-700'
                                      }`}>
                                        {procedure.status === 'completed' ? 'Completado' : 'En Proceso'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0">
                                  {procedure.status === 'completed' ? (
                                    <div className="flex items-center gap-2">
                                      <div className="h-8 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all duration-200 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer">
                                        <Download className="h-3.5 w-3.5" />
                                        <span className="text-xs">PDF</span>
                                      </div>
                                      <div className="h-8 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-all duration-200 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer">
                                        <FileText className="h-3.5 w-3.5" />
                                        <span className="text-xs">WORD</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="h-8 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer">
                                      <Copy className="h-3.5 w-3.5" />
                                      <span className="text-xs">Copiar Link</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-xl transform scale-105 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Editor Preview Section */}
      <section className="bg-white border-y border-slate-200 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 text-slate-900 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium">Editor Inteligente</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 mb-4 px-4">
              Creación de Documentos Intuitiva
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-light px-4">
              Cree documentos legales dinámicos con nuestro editor intuitivo. Inserte variables que se convertirán en formularios personalizados.
            </p>
          </div>

          <div className="relative px-4 sm:px-0">
            {/* Editor Preview Content */}
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
              {/* Mock Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full max-w-sm mx-auto h-8 rounded-lg bg-white shadow-sm flex items-center px-3 border border-slate-200">
                    <FileText className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-400">formai.cl/documents/new</span>
                  </div>
                </div>
              </div>

              {/* Editor Content */}
              <div className="grid grid-cols-[1fr_300px] divide-x divide-slate-200">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-serif font-semibold text-slate-900">Contrato de Alquiler</h3>
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">Borrador</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Vista Previa</span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed">
                      En la ciudad de <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{ciudad}}'}</span>, 
                      a los <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{dia}}'}</span> días del mes 
                      de <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{mes}}'}</span> del año <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{año}}'}</span>, 
                      entre <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{nombre_arrendador}}'}</span>, 
                      con domicilio en <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{domicilio_arrendador}}'}</span>...
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      El inmueble objeto del presente contrato se encuentra ubicado en <span className="bg-blue-50 text-blue-700 px-1 rounded cursor-pointer">{'{{direccion_inmueble}}'}</span>...
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 sm:p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-3">Variables Detectadas</h4>
                      <div className="space-y-2">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-mono text-slate-600">ciudad</span>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-mono text-slate-600">nombre_arrendador</span>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-mono text-slate-600">domicilio_arrendador</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-900">Insertar Variable</h4>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Nombre de la variable"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded"
                        >
                          Insertar
                        </motion.button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-lg border border-slate-200">
                      <h4 className="text-sm font-medium text-slate-900 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Tip
                      </h4>
                      <p className="text-xs text-slate-600">
                        Las variables se convertirán automáticamente en campos de formulario para que sus clientes los completen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-transparent rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 text-xs">01</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-slate-900">Editor Inteligente</h3>
                    <div className="w-12 h-1 bg-emerald-100 mt-2"></div>
                  </div>
                </div>
                <p className="text-slate-800 leading-relaxed text-justify font-light text-sm">
                  Interfaz limpia y profesional diseñada para crear documentos sin distracciones. Experiencia de edición fluida y natural.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-transparent rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 text-xs">02</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-slate-900">Variables Dinámicas</h3>
                    <div className="w-12 h-1 bg-blue-100 mt-2"></div>
                  </div>
                </div>
                <p className="text-slate-800 leading-relaxed text-justify font-light text-sm">
                  Inserte variables que se transforman automáticamente en campos de formulario personalizados para sus clientes.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
              <div className="relative bg-transparent rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 text-xs">03</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-slate-900">Vista Previa</h3>
                    <div className="w-12 h-1 bg-purple-100 mt-2"></div>
                  </div>
                </div>
                <p className="text-slate-800 leading-relaxed text-justify font-light text-sm">
                  Visualice en tiempo real cómo quedará su documento final mientras lo edita. Sin sorpresas, sin ajustes posteriores.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Document Preview Section */}
      <section className="bg-gradient-to-b from-slate-50 to-slate-100 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 text-slate-900 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium">Documento Final</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-slate-900 mb-4 px-4">
              Del Template al Documento Final
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-light px-4">
              Sus clientes completan un formulario simple y automáticamente obtienen el documento personalizado.
            </p>
          </div>

          <div className="relative px-4 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Preview */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full max-w-sm mx-auto h-8 rounded-lg bg-white shadow-sm flex items-center px-3 border border-slate-200">
                      <FileText className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-400">formai.cl/documents/fill/contrato-alquiler</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-serif font-semibold text-slate-900 mb-2">Complete el Formulario</h3>
                    <p className="text-sm text-slate-600">Los campos se actualizarán automáticamente en su documento.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad</label>
                      <input type="text" value="Santiago" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-slate-50" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Arrendador</label>
                      <input type="text" value="Juan Pérez González" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-slate-50" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Domicilio del Arrendador</label>
                      <input type="text" value="Av. Providencia 1234, Providencia" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-slate-50" readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Dirección del Inmueble</label>
                      <input type="text" value="Calle Las Flores 567, Las Condes" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 bg-slate-50" readOnly />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Formulario Completado</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Document Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-white"
              >
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full max-w-sm mx-auto h-8 rounded-lg bg-white shadow-sm flex items-center px-3 border border-slate-200">
                      <FileText className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-400">Contrato de Alquiler - Vista Previa</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-white">
                  <div className="max-w-[600px] mx-auto space-y-6">
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">CONTRATO DE ALQUILER</h1>
                      <div className="w-16 h-1 bg-slate-200 mx-auto"></div>
                    </div>

                    <div className="prose prose-slate max-w-none text-sm leading-relaxed">
                      <p>
                        En la ciudad de <span className="font-medium">Santiago</span>, 
                        a los <span className="font-medium">15</span> días del mes 
                        de <span className="font-medium">marzo</span> del año <span className="font-medium">2024</span>, 
                        entre <span className="font-medium">Juan Pérez González</span>, 
                        con domicilio en <span className="font-medium">Av. Providencia 1234, Providencia</span>, 
                        en adelante "EL ARRENDADOR"...
                      </p>
                      
                      <p>
                        El inmueble objeto del presente contrato se encuentra ubicado en <span className="font-medium">Calle Las Flores 567, Las Condes</span>...
                      </p>

                      <p className="text-slate-500">
                        [Contenido del contrato...]
                      </p>
                    </div>

                    <div className="pt-12 mt-12 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-12">
                        <div className="text-center">
                          <div className="h-0.5 w-48 bg-slate-900 mx-auto mb-2"></div>
                          <p className="text-sm text-slate-600">El Arrendador</p>
                          <p className="text-sm font-medium">Juan Pérez González</p>
                        </div>
                        <div className="text-center">
                          <div className="h-0.5 w-48 bg-slate-900 mx-auto mb-2"></div>
                          <p className="text-sm text-slate-600">El Arrendatario</p>
                          <p className="text-sm font-medium">María Silva Rodríguez</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      Documento generado automáticamente
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">PDF</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">WORD</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* New Features Section */}
            <div className="mt-24 relative">
              <div className="absolute inset-0 rounded-3xl"></div>
              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                  <div className="relative bg-transparentrounded-xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-blue-700 text-xs">01</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-semibold text-slate-900">Formulario Inteligente</h3>
                        <div className="w-12 h-1 bg-blue-100 mt-2"></div>
                      </div>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-justify font-light text-sm">
                      Sus clientes reciben un link personalizado para completar un formulario intuitivo. Sin necesidad de cuentas o registros adicionales.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                  <div className="relative bg-transparent rounded-xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                          <FileCheck className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center">
                          <span className="text-emerald-700 text-xs">02</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-semibold text-slate-900">Control</h3>
                        <div className="w-12 h-1 bg-emerald-100 mt-2"></div>
                      </div>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-justify font-light text-sm">
                      Usted mantiene el control. Genere el documento cuando lo necesite, con la seguridad de que toda la información está correctamente validada.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
                  <div className="relative bg-transparent rounded-xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                          <Download className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 text-xs">03</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-serif font-semibold text-slate-900">Flexibilidad</h3>
                        <div className="w-12 h-1 bg-purple-100 mt-2"></div>
                      </div>
                    </div>
                    <p className="text-slate-800 leading-relaxed text-justify font-light text-sm">
                      Exporte sus documentos en múltiples formatos. Desde PDFs profesionales hasta documentos Word editables, adaptados a sus necesidades.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source Section */}
      <section className="bg-gradient-to-b from-slate-50 to-slate-100 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(200,200,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="p-2 bg-slate-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-slate-100" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-semibold text-slate-900">
                  Formai<span className="text-emerald-500">.</span>
                </h2>
              </div>
            </motion.div>
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 mb-8 font-light px-4">
              Este proyecto es completamente open source y está disponible para que todos puedan crear sus documentos, 
              experimentar y contribuir.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="https://github.com/platanus-build-night/build-night-1-gianpisani"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Github className="w-5 h-5" />
                <span>Ver en GitHub</span>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                href="https://github.com/platanus-build-night/build-night-1-gianpisani/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
              >
                <Star className="w-5 h-5" />
                <span>Crear Issue</span>
              </motion.a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

